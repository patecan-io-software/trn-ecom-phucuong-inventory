import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import {
	BadRequestException,
	createExceptionFilter,
	SuccessResponseInterceptor,
} from '@libs'
import { RESULT_CODE_MAPPING } from './config/result-code-mapping.config'

const GlobalExceptionFilter = createExceptionFilter(RESULT_CODE_MAPPING)

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors()
	app.useGlobalInterceptors(new SuccessResponseInterceptor())
	app.useGlobalFilters(new GlobalExceptionFilter())
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			exceptionFactory: (errors) => new BadRequestException(errors),
		}),
	)
	app.setGlobalPrefix('api')

	const config = new DocumentBuilder()
		.setTitle('Inventory Service')
		.setDescription('Inventory Service API description')
		.setVersion('0.0.1')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('swagger', app, document)

	const host = process.env.HOST
	const port = parseInt(process.env.PORT || '3000')
	await app.listen(port, host, () => {
		Logger.log(`Application is running at: ${host}:${port}`)
	})
}
bootstrap()
