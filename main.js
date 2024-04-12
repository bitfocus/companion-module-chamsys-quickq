import { InstanceBase, Regex, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { getActions } from './actions.js'
import { getPresets } from './presets.js'
import { getVariables } from './variables.js'
import { getFeedbacks } from './feedbacks.js'
import UpgradeScripts from './upgrades.js'

import OSC from 'osc'

class QuickQInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.playbacks = {}

		this.updateStatus(InstanceStatus.Connecting)

		this.initActions()
		this.initPresets()
		this.initVariables()
		this.initFeedbacks()

		if (this.config.host) {
			this.updateStatus(InstanceStatus.Ok)
			this.initOSC()
		} else {
			this.updateStatus('bad_config', 'Missing IP Address')
		}
	}

	async destroy() {
		if (this.listener) {
			this.listener.close()
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config

		this.initOSC()
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

	initOSC() {
		console.log("Setting up UPD Socket")
		this.states = {}

		if (this.listener) {
			this.listener.close()
		}

		this.listener = new OSC.UDPPort({
			localAddress: '0.0.0.0',
			localPort: 9000,
			broadcast: true,
			metadata: true,
		})

		this.listener.open()
		this.listener.on('ready', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.sendCommand('/feedback/pb+exec')
		})
		this.listener.on('error', (err) => {
			if (err.code == 'EADDRINUSE') {
				this.log('error', `Error: Selected feedback port ${err.message.split(':')[1]} is already in use.`)
				this.updateStatus('bad_config', 'Feedback port conflict')
			}
		})

		this.listener.on('message', (message) => {
			let value = message?.args[0]?.value

			if (message?.address.match(/\/pb\/[0-9]+$/)) {
				let playbackInfo = message.address.match(/(\/pb\/)([0-9]+)$/)

				if (playbackInfo?.[2]) {
					let num = playbackInfo[2]
					let percent = Math.round(value * 100)
					this.playbacks[`${num}`] = { fader: percent }
					this.setVariableValues({ [`playback_${num}_level`]: percent })
					this.checkFeedbacks()
				}
			}
		})
	}
}

runEntrypoint(QuickQInstance, UpgradeScripts)
