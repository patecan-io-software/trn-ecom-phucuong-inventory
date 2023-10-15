import { Module } from '@nestjs/common'
import { InventoryService } from './services/inventory.service'
import { InventoryController } from './controllers/inventory.controller'
import { MongooseModule } from '@infras/mongoose'
import {
	CatSchema,
	CategoryRepository,
	InventoryRepository,
	categorySchema,
} from './database'
import { CATEGORY_MODEL, CAT_MODEL } from './constants'

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
	controllers: [InventoryController],
})
export class InventoryModule {}
