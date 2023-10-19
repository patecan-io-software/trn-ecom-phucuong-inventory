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
import { BRAND_MODEL, CATEGORY_MODEL, MATERIAL_MODEL } from './constants'
import { CategoryController } from './controllers/category.controller'
import { BrandController } from './controllers/brand.controller'
import { ProductController } from './controllers/product.controller'
import { materialSchema } from './database/models/material.model'
import { ProductMaterialController } from './controllers/material.controller'

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
	],
	controllers: [
		CategoryController,
		BrandController,
		ProductController,
		ProductMaterialController,
	],
})
export class InventoryModule {}
