import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@infras/mongoose'
import { AppConfigModule, DATABASE_CONFIG } from './config'
import { AdminProductModule } from '@modules/admin/product'
import { ProductModule } from '@modules/client/product'
import { ImageUploaderModule } from '@modules/admin/image-uploader'
import { CategoryModule } from '@modules/client/category/category.module'
import { BrandModule } from '@modules/client/brand/brand.module'
import { InventoryModule } from '@modules/admin/inventory'

@Module({
	imports: [
		AppConfigModule,
		MongooseModule.forRootAsync({
			useFactory: (configSevice: ConfigService) =>
				configSevice.get(DATABASE_CONFIG),
			inject: [ConfigService],
		}),

		// application module
		ImageUploaderModule,
		CategoryModule,
		BrandModule,
		ProductModule,

		AdminProductModule,
		InventoryModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
