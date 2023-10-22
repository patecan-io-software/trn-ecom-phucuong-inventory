import { MongoServerError } from './interfaces'

export class MongoDBErrorHandler {
	static DUPLICATED_KEY_ERROR = 11000

	static isDuplicatedKeyError(error: MongoServerError, key: string) {
		if (error.code === this.DUPLICATED_KEY_ERROR) {
			if (error.keyPattern[key] === 1) {
				return true
			}
		}
		return false
	}
}
