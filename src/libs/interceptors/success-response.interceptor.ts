import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs'
import { ResultCode } from '../enums/result-code.enum'

export class SuccessResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			map((data) => {
				return {
					resultCode: data.resultCode || ResultCode.Success, // fallback for result code
					...data,
				}
			}),
		)
	}
}
