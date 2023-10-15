import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from './database.config'
import { validateConfig } from './config-validator'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig],
			validate: validateConfig,
			envFilePath: '.env',
		}),
	],
})
export class AppConfigModule {}
