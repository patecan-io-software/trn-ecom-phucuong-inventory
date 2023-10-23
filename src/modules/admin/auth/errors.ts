import { BaseException } from '@libs'

export class UserUnauthorizedException extends BaseException {
	public code = 'USER_IS_UNAUTHORIZED'

	constructor(message: string) {
		super(message)
	}
}
