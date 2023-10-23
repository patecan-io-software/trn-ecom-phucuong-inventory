import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthType } from './interfaces'
import { ApiHeader } from '@nestjs/swagger'
import { API_KEY_HEADER } from './constants'

export const AdminAuth = (type: AuthType) => {
	const decorators = []
	switch (type) {
		case 'apiKey':
			decorators.push(
				UseGuards(AuthGuard('apiKey')),
				ApiHeader({
					name: API_KEY_HEADER,
					required: false,
				}),
			)
	}

	return applyDecorators(...decorators)
}
