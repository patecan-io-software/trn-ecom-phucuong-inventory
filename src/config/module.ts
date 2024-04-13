import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from './database.config'
import { validateConfig } from './config-validator'
import imageUploaderConfig from './image-uploader.config'
import authConfig from './auth.config'
import adminProductConfig from './admin-product.config'
import dynamicSectionConfig from './dynamic-section.config'
import clientCategoryConfig from './client-category.config'
import ratingConfig from './rating.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				databaseConfig,
				imageUploaderConfig,
				authConfig,
				adminProductConfig,
				dynamicSectionConfig,
				clientCategoryConfig,
				ratingConfig,
			],
			validate: validateConfig,
			envFilePath: '.env',
		}),
	],
})
export class AppConfigModule {}
