import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { ProductService } from './services/product.service'
import {
	BrandRepository,
	CategoryRepository,
	ProductRepository,
	brandSchema,
	categorySchema,
} from './database'
import {
	BRAND_MODEL,
	CATEGORY_MODEL,
	MATERIAL_MODEL,
	PRODUCT_MODULE_CONFIG,
} from './constants'
import { CategoryController } from './controllers/category.controller'
import { BrandController } from './controllers/brand.controller'
import { ProductController } from './controllers/product.controller'
import { materialSchema } from './database/models/material.model'
import { ProductMaterialController } from './controllers/material.controller'
import { ConfigService } from '@nestjs/config'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: CATEGORY_MODEL,
				schema: categorySchema,
			},
			{
				name: BRAND_MODEL,
				schema: brandSchema,
			},
			{
				name: MATERIAL_MODEL,
				schema: materialSchema,
			},
		]),
	],
	providers: [
		ProductService,
		ProductRepository,
		CategoryRepository,
		BrandRepository,
		{
			provide: PRODUCT_MODULE_CONFIG,
			useFactory: (configService: ConfigService) =>
				configService.get(PRODUCT_MODULE_CONFIG),
			inject: [ConfigService],
		},
	],
	controllers: [
		CategoryController,
		BrandController,
		ProductController,
		ProductMaterialController,
	],
})
export class AdminProductModule {}
