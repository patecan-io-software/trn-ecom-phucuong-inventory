import { Module } from '@nestjs/common'
import { ProductController } from './controllers/product.controller'

@Module({
	providers: [],
	controllers: [ProductController],
})
export class ProductModule {}
