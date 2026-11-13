import { feedbackSubscribeAddress, flashArgument, tenSceneAddress } from './osc.js'

const QUICKQ10_PLAYBACK =
	'On a QuickQ 10, playback 1 is the cue stack. The chase playbacks from left to right are 3 and 2.'

export function getActions() {
	let actions = {
		playbackLevel: {
			name: 'Set playback fader level',
			description: QUICKQ10_PLAYBACK,
			options: [
				{
					id: 'playback',
					type: 'number',
					label: 'Playback',
					default: 1,
					min: 1,
					max: 10,
				},
				{
					id: 'level',
					type: 'number',
					label: 'Level',
					default: 100,
					min: 0,
					max: 100,
					range: true,
				},
			],
			callback: (action) => {
				this.sendCommand(`/pb/${action.options.playback}`, action.options.level)
			},
		},
		playbackGo: {
			name: 'Go on playback',
			description: QUICKQ10_PLAYBACK,
			options: [
				{
					id: 'playback',
					type: 'number',
					label: 'Playback',
					default: 1,
					min: 1,
					max: 10,
				},
			],
			callback: (action) => {
				this.sendCommand(`/pb/${action.options.playback}/go`)
			},
		},
		playbackFlash: {
			name: 'Flash playback',
			description: `Sets the playback to 100%, or releases it to 0%. ${QUICKQ10_PLAYBACK}`,
			options: [
				{
					id: 'playback',
					type: 'number',
					label: 'Playback',
					default: 1,
					min: 1,
					max: 10,
				},
				{
					id: 'level',
					type: 'dropdown',
					label: 'Level',
					default: '100',
					choices: [
						{ id: '100', label: '100%' },
						{ id: '0', label: '0%' },
					],
				},
			],
			callback: (action) => {
				this.sendCommand(`/pb/${action.options.playback}/flash`, flashArgument(action.options.level))
			},
		},
		playbackPause: {
			name: 'Pause playback',
			description: QUICKQ10_PLAYBACK,
			options: [
				{
					id: 'playback',
					type: 'number',
					label: 'Playback',
					default: 1,
					min: 1,
					max: 10,
				},
			],
			callback: (action) => {
				this.sendCommand(`/pb/${action.options.playback}/pause`)
			},
		},
		playbackRelease: {
			name: 'Release playback',
			description: QUICKQ10_PLAYBACK,
			options: [
				{
					id: 'playback',
					type: 'number',
					label: 'Playback',
					default: 1,
					min: 1,
					max: 10,
				},
			],
			callback: (action) => {
				this.sendCommand(`/pb/${action.options.playback}/release`)
			},
		},
		tenSceneButtonControl: {
			name: 'Control 10Scene button',
			description: 'With a zone set, QuickQ reads the first number as the zone: /10scene/<zone>/<item>.',
			options: [
				{
					id: 'item',
					type: 'number',
					label: 'Item',
					default: 1,
					min: 1,
					max: 10,
				},
				{
					id: 'zone',
					type: 'number',
					label: 'Zone (Optional)',
					default: '',
					min: 1,
				},
				{
					id: 'activate',
					type: 'checkbox',
					label: 'Activate',
					default: true,
				},
			],
			callback: (action) => {
				this.sendCommand(tenSceneAddress(action.options.item, action.options.zone), action.options.activate ? 1 : 0)
			},
		},
		feedbackStart: {
			name: 'Start feedback',
			options: [
				{
					id: 'feedback_pb',
					type: 'checkbox',
					label: 'Playbacks',
					default: true,
				},
				{
					id: 'feedback_exec',
					type: 'checkbox',
					label: 'Executes',
					default: true,
				},
			],
			callback: (action) => {
				const address = feedbackSubscribeAddress(action.options.feedback_pb, action.options.feedback_exec)
				if (address) this.sendCommand(address)
			},
		},
		feedbackStop: {
			name: 'Stop feedback',
			options: [],
			callback: (action) => {
				this.sendCommand(`/feedback/off`)
			},
		},
		restOSC: {
			name: 'Reset OSC',
			options: [],
			callback: (action) => {
				this.initOSC()
			},
		},
	}
	return actions
}
