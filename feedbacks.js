import { combineRgb } from '@companion-module/base'

export function getFeedbacks() {
	const feedbacks = {}

	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)

	feedbacks['playbackLevel'] = {
		type: 'boolean',
		name: 'Playback level',
		description: 'Change style if the playback fader level is at or above the selected level',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
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
		callback: (feedback) => {
			return this.playbacks[`${feedback.options.playback}`]?.fader >= feedback.options.level
		},
	}

	feedbacks['executeState'] = {
		type: 'boolean',
		name: 'Execute state',
		description:
			'Change style if the execute at /exec/<row>/<execute> is active. Execute 5 on the first row is /exec/1/5.',
		defaultStyle: {
			color: ColorWhite,
			bgcolor: ColorGreen,
		},
		options: [
			{
				id: 'row',
				type: 'number',
				label: 'Row',
				default: 1,
				min: 1,
				max: 10,
			},
			{
				id: 'execute',
				type: 'number',
				label: 'Execute',
				default: 1,
				min: 1,
				max: 10,
			},
		],
		callback: (feedback) => {
			const row = feedback.options.row || 1
			return this.executes[`${row}_${feedback.options.execute}`]?.state > 0
		},
	}

	return feedbacks
}
