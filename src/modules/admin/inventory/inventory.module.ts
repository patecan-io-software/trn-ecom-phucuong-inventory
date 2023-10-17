import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { InventoryService } from './services/inventory.service'
import { InventoryController } from './controllers/inventory.controller'
import {
	BrandRepository,
	CategoryRepository,
	InventoryRepository,
	brandSchema,
	categorySchema,
	inventorySchema,
} from './database'
import { BRAND_MODEL, CATEGORY_MODEL, INVENTORY_MODEL } from './constants'
import { CategoryController } from './controllers/category.controller'
import { BrandController } from './controllers/brand.controller'
import { ProductController } from './controllers/product.controller'

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
				name: INVENTORY_MODEL,
				schema: inventorySchema,
			},
		]),
	],
	providers: [
		InventoryService,
		InventoryRepository,
		CategoryRepository,
		BrandRepository,
	],
	controllers: [
		InventoryController,
		CategoryController,
		BrandController,
		ProductController,
	],
})
export class InventoryModule {}
