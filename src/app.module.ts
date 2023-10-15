import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@infras/mongoose'
import { AppConfigModule, DATABASE_CONFIG } from './config'
import { InventoryModule } from './modules/admin/inventory'
import { ProductModule } from '@modules/client/product'

@Module({
	imports: [
		AppConfigModule,
		MongooseModule.forRootAsync({
			useFactory: (configSevice: ConfigService) =>
				configSevice.get(DATABASE_CONFIG),
			inject: [ConfigService],
		}),

		// application module
		InventoryModule,
		ProductModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
