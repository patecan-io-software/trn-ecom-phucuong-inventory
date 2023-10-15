import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { InventoryService } from './services/inventory.service'
import { InventoryController } from './controllers/inventory.controller'
import {
	CatSchema,
	CategoryRepository,
	InventoryRepository,
	categorySchema,
} from './database'
import { CATEGORY_MODEL, CAT_MODEL } from './constants'
import { CategoryController } from './controllers/category.controller'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: CAT_MODEL,
				schema: CatSchema,
			},
			{
				name: CATEGORY_MODEL,
				schema: categorySchema,
			},
		]),
	],
	providers: [InventoryService, InventoryRepository, CategoryRepository],
	controllers: [InventoryController, CategoryController],
})
export class InventoryModule {}
