import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { BrandRepository, brandSchema } from '@modules/client/brand/database'
import { BrandController } from '@modules/client/brand/controllers/brand.controller'
import { ProductRepository } from '@modules/client/product/database'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Brand',
				schema: brandSchema,
			},
		]),
	],
	providers: [BrandRepository, ProductRepository],
	controllers: [BrandController],
})
export class BrandModule {}
