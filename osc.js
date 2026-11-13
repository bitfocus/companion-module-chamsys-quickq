// QuickQ accepts a playback level as a float 0.0–1.0 or an integer 0–100.
// Feedback uses the same two forms, distinguished by the OSC argument type.
export function oscLevelToPercent(arg) {
	const value = typeof arg === 'number' ? arg : arg?.value
	if (typeof value !== 'number' || Number.isNaN(value)) return undefined

	const type = typeof arg === 'object' && arg ? arg.type : undefined
	let percent
	if (type === 'i' || type === 'h') {
		percent = value
	} else if (type === 'f' || type === 'd') {
		percent = value * 100
	} else if (Number.isInteger(value) && Math.abs(value) > 1) {
		percent = value
	} else {
		percent = value * 100
	}

	return Math.max(0, Math.min(100, Math.round(percent)))
}

export function parsePlaybackAddress(address) {
	const match = typeof address === 'string' ? address.match(/^\/pb\/(\d+)$/) : null
	return match ? Number(match[1]) : undefined
}

// QuickQ reports execute state as /exec/<row>/<execute>, for example /exec/1/10.
export function parseExecuteAddress(address) {
	const match = typeof address === 'string' ? address.match(/^\/exec\/(\d+)\/(\d+)$/) : null
	if (!match) return undefined

	return {
		row: Number(match[1]),
		execute: Number(match[2]),
	}
}

// The QuickQ manual lists /10scene/<item>/<zone>, but the console reads the first
// number as the zone. Item 1 in zone 4 is /10scene/4/1.
export function tenSceneAddress(item, zone) {
	if (Number(zone) > 0) return `/10scene/${Number(zone)}/${item}`
	return `/10scene/${item}`
}

export function feedbackSubscribeAddress(playback, execute) {
	const parts = []
	if (playback) parts.push('pb')
	if (execute) parts.push('exec')
	if (parts.length === 0) return undefined
	return `/feedback/${parts.join('+')}`
}

// /pb/<playback>/flash: 0 is 0%, any non-zero value is 100%.
export function flashArgument(level) {
	return level === '0' || level === 0 || level === false ? 0 : 1
}
