export function getActions() {
	let actions = {
		playbackLevel: {
			name: 'Set playback fader level',
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
			description: 'Sets playback level to 100%',
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
				this.sendCommand(`/pb/${action.options.playback}/flash`, 100)
			},
		},
		playbackPause: {
			name: 'Pause playback',
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
				let zone = ''
				if (action.options.zone > 0) {
					zone = `/${action.options.zone}`
				}
				this.sendCommand(`/10scene/${action.options.item}${zone}`, action.options.activate ? 1 : 0)
			},
		},
		feedbackStart: {
			name: 'Start feedback',
			options: [
				{
					id: 'feedback_pb',
					type: 'checkbox',
					label: 'Playbacks',
					default: true
				},
				{
					id: 'feedback_exec',
					type: 'checkbox',
					label: 'Executes',
					default: true
				}
			],
			callback: (action) => {
				let command = ''

				if(action.options.feedback_pb) command += "pb"
				if(action.options.feedback_pb && action.options.feedback_exec) command += "+"
				if(action.options.feedback_exec) command += "exec"
				this.sendCommand(`/feedback/${command}`)
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
