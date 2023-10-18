import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { CategoryService } from '@modules/client/category/services'
import {
	CategoryRepository,
	categorySchema,
} from '@modules/client/category/database'
import { CategoryController } from '@modules/client/category/controllers/category.controller'
import { ProductRepository } from '@modules/client/product/database'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Category',
				schema: categorySchema,
			},
		]),
	],
	providers: [CategoryService, CategoryRepository, ProductRepository],
	controllers: [CategoryController],
})
export class CategoryModule {}
