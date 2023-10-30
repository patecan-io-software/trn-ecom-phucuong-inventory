import { ValidationError } from 'class-validator'
import { BaseException } from './exception.base'

export class BadRequestException extends BaseException {
	code = 'INVALID_REQUEST_DATA'

	constructor(validationErrors: ValidationError[]) {
		let message
		if (validationErrors.length === 0) {
			message = 'Invalid request data'
		} else {
			const list = validationErrors
			let error = list.pop()
			while (error) {
				if (!error.constraints) {
					list.push(...error.children)
					error = list.pop()
					continue
				}
				message = Object.values(error.constraints)[0]
				break
			}
		}
		super(message)
	}
}
