
export class Utils {
	static escapeRegExp(string: string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escapes special characters
	}

}
