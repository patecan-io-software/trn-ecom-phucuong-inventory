import { ValidationError } from 'class-validator'
import { BaseException } from './exception.base'

export class BadRequestException extends BaseException {
	code = 'INVALID_REQUEST_DATA'

	constructor(validationErrors: ValidationError[]) {
		let message
		if (validationErrors.length === 0) {
			message = 'Invalid request data'
		} else {
			message = Object.values(validationErrors[0].constraints)[0]
		}
		super(message)
	}
}
