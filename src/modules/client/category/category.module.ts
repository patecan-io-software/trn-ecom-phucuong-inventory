import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { CategoryService } from '@modules/client/category/services'
import { CategoryRepository, categorySchema } from '@modules/client/category/database'
import { CategoryController } from '@modules/client/category/controllers/category.controller'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: "Category",
				schema: categorySchema,
			},
		]),
	],
	providers: [
		CategoryService,
		CategoryRepository,
	],
	controllers: [CategoryController],
})
export class CategoryModule {}


