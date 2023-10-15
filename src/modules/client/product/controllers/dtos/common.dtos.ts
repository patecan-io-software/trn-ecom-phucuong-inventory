import { ApiProperty } from '@nestjs/swagger'

export class ProductBrand {
	@ApiProperty()
	_id: string

	@ApiProperty()
	brand_name: string

	@ApiProperty()
	brand_logoUrl: string
}

export class ProductCategory {
	@ApiProperty()
	_id: string

	@ApiProperty()
	category_name: string

	@ApiProperty()
	category_logoUrl: string
}

export class ProductVariant {
	@ApiProperty()
	variant_sku: string

	@ApiProperty()
	variant_color: string

	@ApiProperty()
	variant_material: string

	@ApiProperty()
	variant_price: number
}

export class ProductDTO {
	@ApiProperty()
	_id: string

	@ApiProperty()
	product_name: string

	@ApiProperty()
	product_description: string

	@ApiProperty()
	product_banner_image: string

	@ApiProperty()
	product_slug: string // --> Quan-Jean-cao-cap

	@ApiProperty()
	product_type: string

	@ApiProperty({
		type: ProductBrand,
	})
	product_brand: ProductBrand

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
