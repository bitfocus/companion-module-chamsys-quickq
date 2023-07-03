export function getVariables() {
	const variables = []

	for (let i = 1; i < 11; i++) {
		variables.push({
			name: `Playback ${i} - Level`,
			variableId: `playback_${i}_level`,
		})
	}

	return variables
}
