import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from './database.config'
import { validateConfig } from './config-validator'
import imageUploaderConfig from './image-uploader.config'
import authConfig from './auth.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig, imageUploaderConfig, authConfig],
			validate: validateConfig,
			envFilePath: '.env',
		}),
	],
})
export class AppConfigModule {}
