import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
	ClassSerializerInterceptor,
	Logger,
	ValidationPipe,
} from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import {
	BadRequestException,
	GlobalExceptionFilter,
	SuccessResponseInterceptor,
} from '@libs'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors()
	app.useGlobalInterceptors(new SuccessResponseInterceptor())
	app.useGlobalFilters(new GlobalExceptionFilter())
	app.useGlobalPipes(
		new ValidationPipe({
			transform: false,
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
