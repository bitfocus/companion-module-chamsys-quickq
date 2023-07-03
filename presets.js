import { combineRgb } from '@companion-module/base'

export function getPresets() {
	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)

	let presets = {}

	for (let i = 1; i < 11; i++) {
		presets[`set_playback_${i}_0`] = {
			type: 'button',
			category: 'Set Playback Level',
			name: `Playback ${i} - 0%`,
			options: {},
			style: {
				text: `Playback\\n${i}\\nSet 0%`,
				size: 14,
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'playbackLevel',
							options: {
								playback: i,
								level: 0,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets[`set_playback_${i}_100`] = {
			type: 'button',
			category: 'Set Playback Level',
			name: `Playback ${i} - 100%`,
			options: {},
			style: {
				text: `Playback\\n${i}\\nSet 100%`,
				size: 14,
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'playbackLevel',
							options: {
								playback: i,
								level: 100,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets[`playback_${i}_level`] = {
			type: 'button',
			category: 'Current Playback Level',
			name: `Playback ${i} Status`,
			options: {},
			style: {
				text: `Playback\\n${i}\\n$(quickq:playback_${i}_level)`,
				size: 14,
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'playbackLevel',
					options: {
						playback: i,
						level: 100,
					},
					style: {
						bgcolor: ColorGreen,
					},
				},
			],
		}
	}

	return presets
}
