// create a nestjs decorator
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const ClientIp = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()
		const ipAddr =
			req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress

		return ipAddr
	},
)
