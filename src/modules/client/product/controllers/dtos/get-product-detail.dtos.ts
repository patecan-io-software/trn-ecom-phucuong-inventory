import { ApiProperty } from '@nestjs/swagger'
import {
	ProductBrand,
	ProductCategory,
	ProductColor,
	ProductVariant,
	ProductImage,
} from './common.dtos'
import { Type } from 'class-transformer'

export class GetProductDetailResponseDTO {
	@ApiProperty()
	resultCode: string

	@ApiProperty()
	resultMessage: string

	@ApiProperty()
	_id: string

	@ApiProperty()
	product_name: string

	@ApiProperty()
	product_description: string

	@ApiProperty()
	product_banner_image: string

	@ApiProperty()
	product_images: string[]

	@ApiProperty()
	product_slug: string // --> Quan-Jean-cao-cap

	@ApiProperty()
	product_type: string

	@ApiProperty({
		type: ProductBrand,
	})
	product_brand: ProductBrand

	@ApiProperty({
		type: [ProductColor],
	})
	product_colors: ProductColor[]

	@ApiProperty()
	product_materials: string[]

	@ApiProperty({
		type: [ProductVariant],
	})
	product_variants: ProductVariant[]

	@ApiProperty({
		type: [ProductCategory],
	})
	product_categories: ProductCategory[]

	@ApiProperty()
	sku: string

	@ApiProperty()
	price: number

	@ApiProperty()
	discountPercentage: number

	@ApiProperty()
	discountPrice: number

	@ApiProperty()
	quantity: number

	@ApiProperty({
		type: ProductImage,
	})
	@Type(() => ProductImage)
	image: ProductImage
}
