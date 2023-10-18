import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ProductBrand {
	@ApiProperty()
	_id: string

	@ApiProperty()
	brand_name: string

	@ApiProperty()
	brand_logoUrl: string
}

export class ProductColor {
	@ApiProperty()
	label: string

	@ApiProperty()
	value: string
}

export class ProductImage {
	@ApiProperty()
	imageName: string

	@ApiProperty()
	imageUrl: string
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
	sku: string

	@ApiProperty({
		type: ProductColor,
	})
	color: ProductColor

	@ApiProperty()
	material: string

	@ApiProperty()
	quantity: number

	@ApiProperty()
	price: number

	@ApiProperty()
	discountPercentage: number

	@ApiProperty()
	discountPrice: number

	@ApiProperty({
		type: [ProductImage],
	})
	@Type(() => ProductImage)
	image_list: ProductImage[]
}

export class ProductDTO {
	constructor(props: any) {
		Object.assign(this, props)
	}

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
