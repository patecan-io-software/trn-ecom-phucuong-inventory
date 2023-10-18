import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

class ProductWeight {
	@ApiProperty()
	type: number

	@ApiProperty()
	value: string
}

class ProductImage {
	@ApiProperty()
	imageName: string

	@ApiProperty()
	imageUrl: string
}

export class CreateProductVariantDTO {
	@ApiProperty()
	sku: string

	@ApiProperty()
	color: string

	@ApiProperty()
	material: string

	@ApiProperty()
	quantity: number

	@ApiProperty()
	price: number

	@ApiProperty({
		type: [ProductImage],
	})
	@Type(() => ProductImage)
	image_list: ProductImage[]
}
