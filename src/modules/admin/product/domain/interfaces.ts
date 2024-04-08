import { ProductVariant } from './product-variant'
import { ProductImage, ProductVariantStatus } from './types'

export interface CreateProductDTO {
	product_name: string
	product_description: string
	product_specifications: string
	product_storage_instructions: string
	product_banner_image: string
	product_brand: string
	product_categories: string[]
	product_variants: CreateProductVariantDTO[]
	product_warranty: string
	isPublished?: boolean
	_id?: string
}

export interface UpdateProductDTO {
	product_name: string
	product_description: string
	product_specifications: string
	product_storage_instructions: string
	product_banner_image: string
	product_brand: string
	product_categories: string[]
	product_variants: UpdateProductVariantDTO[]
	product_warranty: string
	isPublished?: boolean
}

export interface CreateProductVariantDTO {
	sku: string
	color: {
		label: string
		value: string
	}
	material: string
	measurement: {
		width: number
		height: number
		length: number
		weight: number
		sizeUnit: string
		weightUnit: string
	}
	price: number
	discount_price: number
	discount_percentage?: number
	quantity: number
	image_list: ProductImage[]
	status?: ProductVariantStatus
}

export type UpdateProductVariantDTO = CreateProductVariantDTO

export interface UpdateProductVariantResult {
	newVariantList: ProductVariant[]
	updatedVariantList: ProductVariant[]
	deletedVariantList: ProductVariant[]
}
