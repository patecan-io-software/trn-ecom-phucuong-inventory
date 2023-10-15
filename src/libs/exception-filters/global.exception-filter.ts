import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { BaseException } from '../exceptions/exception.base'
import { ResultCode } from '../enums/result-code.enum'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: Error, host: ArgumentsHost) {
		Logger.error(exception.message, exception.stack)

		let statusCode, code, message
		// application exception
		if (exception instanceof HttpException) {
			statusCode = exception.getStatus()
			code = exception.name
			message = exception.message
		} else if (exception instanceof BaseException) {
			statusCode = 400
			code = exception.code
			message = exception.message
		} else {
			statusCode = 500
			code = 'INTERNAL_SERVER_ERROR'
			message = 'Internal server error'
		}

		const res = host.switchToHttp().getResponse() as Response
		res.status(statusCode).json({
			resultCode: ResultCode.Error,
			code,
			message,
		})
	}
}
