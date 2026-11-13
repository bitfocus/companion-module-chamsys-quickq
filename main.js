import { InstanceBase, Regex, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { getActions } from './actions.js'
import { getPresets } from './presets.js'
import { getVariables } from './variables.js'
import { getFeedbacks } from './feedbacks.js'
import UpgradeScripts from './upgrades.js'

import OSC from 'osc'
import { oscLevelToPercent, parseExecuteAddress, parsePlaybackAddress } from './osc.js'

// QuickQ only sends playback/execute state after it receives /feedback/pb+exec.
// If Companion starts first, that packet is lost, so keep resending until feedback arrives.
const OSC_RETRY_MS = 10 * 1000

class QuickQInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.playbacks = {}
		this.executes = {}

		this.updateStatus(InstanceStatus.Connecting)

		this.initActions()
		this.initPresets()
		this.initVariables()
		this.initFeedbacks()

		if (this.config.host) {
			this.initOSC()
		} else {
			this.updateStatus('bad_config', 'Missing IP Address')
		}
	}

	async destroy() {
		this.clearOscRetry()

		if (this.listener) {
			this.listener.close()
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config

		if (this.config.host) {
			this.initOSC()
		} else {
			this.clearOscRetry()
			this.updateStatus('bad_config', 'Missing IP Address')
		}
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Device IP',
				width: 8,
				regex: Regex.IP,
			},
		]
	}

	initVariables() {
		const variables = getVariables.bind(this)()
		this.setVariableDefinitions(variables)
	}

	initFeedbacks() {
		const feedbacks = getFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
	}

	initPresets() {
		const presets = getPresets.bind(this)()
		this.setPresetDefinitions(presets)
	}

	initActions() {
		const actions = getActions.bind(this)()
		this.setActionDefinitions(actions)
	}

	sendCommand(command, value) {
		if (value || value === 0) {
			this.oscSend(this.config.host, 8000, `${command}`, [
				{
					type: 'i',
					value: value,
				},
			])
		} else {
			this.oscSend(this.config.host, 8000, `${command}`, [])
		}
	}

	clearOscRetry() {
		if (this.oscRetryTimer) {
			clearTimeout(this.oscRetryTimer)
			delete this.oscRetryTimer
		}
	}

	scheduleOscRetry() {
		this.clearOscRetry()

		this.oscRetryTimer = setTimeout(() => {
			delete this.oscRetryTimer

			if (this.oscFeedbackReceived || !this.config?.host) return

			this.log('debug', 'No OSC feedback received, retrying connection')
			this.sendCommand('/feedback/pb+exec')
			this.scheduleOscRetry()
		}, OSC_RETRY_MS)
	}

	initOSC() {
		//console.log('Setting up UPD Socket')
		this.clearOscRetry()
		this.oscFeedbackReceived = false
		this.states = {}
		this.updateStatus(InstanceStatus.Connecting)

		if (this.listener) {
			this.listener.close()
		}

		this.listener = new OSC.UDPPort({
			localAddress: '0.0.0.0',
			localPort: 9000,
			broadcast: true,
			metadata: true,
		})

		this.listener.on('ready', () => {
			this.sendCommand('/feedback/pb+exec')

			if (!this.oscFeedbackReceived) {
				this.scheduleOscRetry()
			}
		})
		this.listener.on('error', (err) => {
			if (err.code == 'EADDRINUSE') {
				this.clearOscRetry()
				this.log('error', `Error: Selected feedback port ${err.message.split(':')[1]} is already in use.`)
				this.updateStatus('bad_config', 'Feedback port conflict')
			}
		})
		this.listener.on('message', (message) => {
			if (!this.oscFeedbackReceived) {
				this.oscFeedbackReceived = true
				this.clearOscRetry()
				this.updateStatus(InstanceStatus.Ok)
			}

			const playback = parsePlaybackAddress(message?.address)
			if (playback) {
				const percent = oscLevelToPercent(message?.args?.[0])
				if (percent !== undefined) {
					this.playbacks[`${playback}`] = { fader: percent }
					this.setVariableValues({ [`playback_${playback}_level`]: percent })
					this.checkFeedbacks()
				}
			} else {
				const execute = parseExecuteAddress(message?.address)
				const value = message?.args?.[0]?.value
				if (execute && typeof value === 'number') {
					const key = `${execute.row}_${execute.execute}`
					this.executes[key] = { state: value }
					this.setVariableValues({ [`execute_${key}_state`]: value })
					this.checkFeedbacks()
				}
			}
		})

		this.listener.open()
	}
}

runEntrypoint(QuickQInstance, UpgradeScripts)
