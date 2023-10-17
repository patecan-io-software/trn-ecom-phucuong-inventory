import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	MinLength,
} from 'class-validator'

class ProductWeight {
	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	type: number

	@ApiProperty()
	@IsNotEmpty()
	value: string
}

class ProductImage {
	@ApiProperty()
	@IsNotEmpty()
	imageName: string

	@ApiProperty()
	@IsNotEmpty()
	imageUrl: string
}

export class CreateProductVariantDTO {
	@ApiProperty()
	@IsNotEmpty()
	sku: string

	@ApiProperty()
	@IsNotEmpty()
	color: string

	@ApiProperty()
	@IsNotEmpty()
	material: string

	@ApiProperty()
	@IsNotEmpty()
	@IsPositive()
	quantity: number

	@ApiProperty()
	@IsNotEmpty()
	@IsPositive()
	price: number

	@ApiProperty({
		type: [ProductImage],
	})
	@Type(() => ProductImage)
	@IsArray()
	@IsOptional()
	@MinLength(0)
	image_list?: ProductImage[] = []
}

export class CreateProductRequestDTO {
	@ApiProperty({
		required: false,
	})
	product_code: string

	@ApiProperty()
	@IsNotEmpty()
	product_name: string

	@ApiProperty()
	@IsNotEmpty()
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

	@ApiProperty()
	@IsNotEmpty()
	@IsPositive()
	quantity: number

	@ApiProperty()
	@IsNotEmpty()
	@IsPositive()
	price: number

	@ApiProperty({
		type: [ProductImage],
	})
	@Type(() => ProductImage)
	@IsArray()
	@IsOptional()
	@MinLength(0)
	image_list?: ProductImage[] = []

	@ApiProperty({
		type: [CreateProductVariantDTO],
	})
	@Type(() => CreateProductVariantDTO)
	product_variant_list: CreateProductVariantDTO[]

	@ApiProperty({
		required: false,
		default: false,
	})
	isPublished: boolean = false
}
