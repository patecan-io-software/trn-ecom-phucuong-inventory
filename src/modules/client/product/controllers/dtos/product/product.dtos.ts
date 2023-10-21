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
	discount_percentage: number

	@ApiProperty()
	discount_price: number

	@ApiProperty({
		type: [ProductImage],
	})
	@Type(() => ProductImage)
	image_list: ProductImage[]
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

	@ApiProperty()
	sku: string

	@ApiProperty()
	price: number

	@ApiProperty()
	discount_percentage: number

	@ApiProperty()
	discount_price: number

	@ApiProperty()
	quantity: number

	@ApiProperty({
		type: ProductImage,
	})
	@Type(() => ProductImage)
	image: ProductImage

	constructor(props: any) {
		Object.assign(this, props)
		const firstVariant = props.product_variants[0]
		this.sku = firstVariant.sku
		this.price = firstVariant.price
		this.discount_percentage = firstVariant.discount_percentage
		this.discount_price = firstVariant.discount_price
		this.quantity = firstVariant.quantity
		this.image = firstVariant.image_list[0]
	}
}

export class ProductDetailResponseDTO {
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
	discount_percentage: number

	@ApiProperty()
	discount_price: number

	@ApiProperty()
	quantity: number

	@ApiProperty({
		type: ProductImage,
	})
	@Type(() => ProductImage)
	image: ProductImage

	constructor(props: any) {
		Object.assign(this, props)
		const firstVariant = props.product_variants[0]
		this.sku = firstVariant.sku
		this.price = firstVariant.price
		this.discount_percentage = firstVariant.discount_percentage
		this.discount_price = firstVariant.discount_price
		this.quantity = firstVariant.quantity
		this.image = firstVariant.image_list[0]
	}
}
