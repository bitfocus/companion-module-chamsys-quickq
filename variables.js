export function getVariables() {
	const variables = []

	for (let i = 1; i < 11; i++) {
		variables.push({
			name: `Playback ${i} - Fader`,
			variableId: `playback_${i}_fader`,
		})
	}

	return variables
}
