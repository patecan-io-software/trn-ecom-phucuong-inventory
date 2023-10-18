import { Module } from '@nestjs/common'
import { ProductController } from './controllers/product.controller'
import { MongooseModule } from '@infras/mongoose'
import { productSchema } from '@modules/client/product/database/models/product.model'
import { ProductRepository } from '@modules/client/product/database'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Product',
				schema: productSchema,
			},
		]),
	],
	providers: [ProductRepository],
	controllers: [ProductController],
})
export class ProductModule {}
