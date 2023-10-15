import { ApiProperty } from '@nestjs/swagger'
import { ProductBrand, ProductCategory, ProductVariant } from './common.dtos'

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

	@ApiProperty()
	product_colors: string[]

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

	// properties of first variant
	@ApiProperty()
	variant_color: string

	@ApiProperty()
	variant_material: string

	@ApiProperty()
	variant_price: number

	@ApiProperty()
	variant_image: string
}
