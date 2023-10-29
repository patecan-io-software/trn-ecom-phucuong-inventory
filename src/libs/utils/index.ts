import { Types } from 'mongoose'

export class Utils {
	static escapeRegExp(string: string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escapes special characters
	}

	static convertStringIdToObjectId(id: string) {
		return new Types.ObjectId(id)
	}
}

export * from './transforms'
export * from './checkers'
