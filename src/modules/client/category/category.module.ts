import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { CategoryRepository, categorySchema } from './database'
import { CategoryController } from './controllers/category.controller'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Category',
				schema: categorySchema,
			},
		]),
	],
	providers: [CategoryRepository],
	controllers: [CategoryController],
})
export class CategoryModule {}
