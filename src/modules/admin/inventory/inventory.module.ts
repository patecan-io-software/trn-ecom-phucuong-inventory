import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { InventoryService } from './services/inventory.service'
import { InventoryController } from './controllers/inventory.controller'
import {
	CategoryRepository,
	InventoryRepository,
	categorySchema,
} from './database'
import { BRAND_MODEL, CATEGORY_MODEL } from './constants'
import { CategoryController } from './controllers/category.controller'
import { BrandController } from './controllers/brand.controller'
import { brandSchema } from './database/models/brand.model'
import { BrandRepository } from './database/brand.repository'

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
		]),
	],
	providers: [
		InventoryService,
		InventoryRepository,
		CategoryRepository,
		BrandRepository,
	],
	controllers: [InventoryController, CategoryController, BrandController],
})
export class InventoryModule {}
