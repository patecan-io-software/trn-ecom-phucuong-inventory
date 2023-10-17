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

export class ProductDTO {
	@ApiProperty({
		required: false,
	})
	product_code: string

	@ApiProperty()
	product_name: string

	@ApiProperty()
	product_description: string

	@ApiProperty()
	product_banner_image: string

	@ApiProperty()
	product_type: string

	@ApiProperty()
	product_brand: string

	@ApiProperty()
	product_categories: string[]

	@ApiProperty()
	product_height: number

	@ApiProperty()
	product_width: number

	@ApiProperty()
	product_length: number

	@ApiProperty()
	product_size_unit: string[]

	@ApiProperty()
	@Type(() => ProductWeight)
	product_weight: ProductWeight

	@ApiProperty({
		type: [CreateProductVariantDTO],
	})
	@Type(() => CreateProductVariantDTO)
	product_variant_list: CreateProductVariantDTO[]

	@ApiProperty()
	status: string
}
