import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { AuthModuleConfig, AuthType } from './interfaces'
import { UserUnauthorizedException } from './errors'
import { API_KEY_HEADER, AUTH_MODULE_CONFIG } from './constants'

@Injectable()
class AuthGuardClass implements CanActivate {
	constructor(
		@Inject(AUTH_MODULE_CONFIG)
		private readonly authGuardConfig: AuthModuleConfig,
	) {}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		if (this.authGuardConfig.bypassApiKey) {
			return true
		}
		const req = context.switchToHttp().getRequest() as Request

		const token = this.extractTokenFromHeader(req)

		if (!token || (token && token !== this.authGuardConfig.apiKey)) {
			throw new UserUnauthorizedException('Invalid token')
		}

		return true
	}

	private extractTokenFromHeader(req: Request) {
		const [type, token] =
			(req.headers[API_KEY_HEADER] as string)?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}

export const AuthGuard = (type: AuthType) => {
	switch (type) {
		case 'apiKey':
			return AuthGuardClass
		default:
			throw new Error('Invalid auth type')
	}
}
