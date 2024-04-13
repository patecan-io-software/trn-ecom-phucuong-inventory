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

export class ProductMeasurement {
	@ApiProperty()
	width: number

	@ApiProperty()
	length: number

	@ApiProperty()
	height: number

	@ApiProperty()
	sizeUnit: string

	@ApiProperty()
	weightUnit: string
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

export class VariantMetadata {
	@ApiProperty()
	color: ProductColor

	@ApiProperty()
	material: string

	@ApiProperty()
	measurement: ProductMeasurement
}

export class ProductVariant {
	@ApiProperty()
	sku: string

	@ApiProperty()
	color: string

	@ApiProperty()
	material: string

	@ApiProperty()
	measurement: string

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

	@ApiProperty({
		type: VariantMetadata,
	})
	@Type(() => VariantMetadata)
	metadata: VariantMetadata
}

export class ClientProductDTO {
	@ApiProperty()
	_id: string

	@ApiProperty()
	product_name: string

	@ApiProperty()
	product_description: string

	@ApiProperty()
	product_specifications: string

	@ApiProperty()
	product_storage_instructions: string

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
	product_warranty: string

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

	@ApiProperty({
		type: VariantMetadata,
	})
	metadata: VariantMetadata

	constructor(props: any) {
		const firstVariant = props.product_variants[0]
		delete props.product_variants

		Object.assign(this, props)
		this.sku = firstVariant.sku
		this.price = firstVariant.price
		this.discount_percentage = firstVariant.discount_percentage
		this.discount_price = firstVariant.discount_price
		this.quantity = firstVariant.quantity
		this.image = firstVariant.image_list[0]
		this.metadata = firstVariant.metadata
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
	product_specifications: string

	@ApiProperty()
	product_storage_instructions: string

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
		type: [ProductVariant],
	})
	product_variants: ProductVariant[]

	@ApiProperty({
		type: [ProductCategory],
	})
	product_categories: ProductCategory[]

	@ApiProperty()
	product_warranty: string

	@ApiProperty({
		type: ProductImage,
	})
	@Type(() => ProductImage)
	image: ProductImage

	constructor(props: any) {
		Object.assign(this, props)

		this.product_variants = props.product_variants.map((variant) => {
			const { property_list, ...variantProps } = variant
			const properties = property_list.reduce((pre, cur) => {
				const { key, value } = cur
				pre[key] = value
				return pre
			}, {})
			return {
				...variantProps,
				color: properties.color ?? null,
				material: properties.material ?? null,
				measurement: properties.measurement ?? null,
			}
		})
	}
}
