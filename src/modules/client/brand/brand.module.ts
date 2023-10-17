import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { BrandRepository, brandSchema } from '@modules/client/brand/database'
import { BrandController } from '@modules/client/brand/controllers/brand.controller'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: "Brand",
				schema: brandSchema,
			},
		]),
	],
	providers: [
		BrandRepository,
	],
	controllers: [BrandController],
})
export class BrandModule {}


