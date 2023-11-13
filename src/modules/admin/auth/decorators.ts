import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthType } from './interfaces'
import { ApiHeader } from '@nestjs/swagger'
import { API_KEY_HEADER } from './constants'

export const AdminAuth = (type: AuthType) => {
	const decorators = [
		ApiHeader({
			name: API_KEY_HEADER,
			required: false,
		}),
	]
	switch (type) {
		case 'apiKey':
			decorators.push(UseGuards(AuthGuard('apiKey')))
		case 'jwtToken':
			decorators.push(UseGuards(AuthGuard('jwtToken')))
		default:
	}

	return applyDecorators(...decorators)
}
