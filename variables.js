export function getVariables() {
	const variables = []

	for (let i = 1; i < 11; i++) {
		variables.push({
			name: `Playback ${i} - Level`,
			variableId: `playback_${i}_level`,
		})
	}

	for (let row = 1; row < 11; row++) {
		for (let execute = 1; execute < 11; execute++) {
			variables.push({
				name: `Execute ${row}/${execute} - State`,
				variableId: `execute_${row}_${execute}_state`,
			})
		}
	}

	return variables
}
