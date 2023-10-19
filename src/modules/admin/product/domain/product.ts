import { DuplicateProductVariantException } from '../errors/product.errors'
import {
	CreateProductVariantProps,
	ProductVariant,
	SerializedProductVariant,
} from './product-variant'
import { ProductImage, ProductStatus, ProductWeight } from './types'

export interface CreateProductDTO {
	product_name: string
	product_description: string
	product_banner_image: ProductImage
	product_brand: string
	product_categories: string[]
	product_height: number
	product_width: number
	product_length: number
	product_size_unit: string
	product_weight: ProductWeight
	product_variants: CreateProductVariantProps[]
	isPublished?: boolean
}

export interface UpdateProductDTO {
	product_name: string
	product_description: string
	product_banner_image: ProductImage
	product_brand: string
	product_categories: string[]
	product_height: number
	product_width: number
	product_length: number
	product_size_unit: string
	product_weight: ProductWeight
	product_variants: CreateProductVariantProps[]
	isPublished?: boolean
}

export interface ProductProps {
	_id?: string
	product_name: string
	product_description: string
	product_banner_image: ProductImage
	product_brand: string
	product_categories: string[]
	product_height: number
	product_width: number
	product_length: number
	product_size_unit: string
	product_weight: ProductWeight
	product_variants: ProductVariant[]
	product_status: ProductStatus
}

export type SerializedProduct = Omit<ProductProps, 'product_variants'> & {
	product_variants: SerializedProductVariant[]
}

export class Product {
	constructor(props: ProductProps) {
		this.props = props
		this.validate()
	}

	update(dto: UpdateProductDTO) {
		if (dto.isPublished !== undefined) {
			this.props.product_status = dto.isPublished
				? ProductStatus.Published
				: ProductStatus.Draft
		}
		this.props.product_name = dto.product_name
		this.props.product_description = dto.product_description
		this.props.product_banner_image = dto.product_banner_image
		this.props.product_brand = dto.product_brand
		this.props.product_categories = dto.product_categories
		this.props.product_height = dto.product_height
		this.props.product_width = dto.product_width
		this.props.product_length = dto.product_length
		this.props.product_size_unit = dto.product_size_unit
		this.props.product_weight = dto.product_weight
		this.props.product_variants.length = 0
		this.props.product_variants = dto.product_variants.map((variant) =>
			ProductVariant.create(variant),
		)

		this.validate()
	}

	serialize(): SerializedProduct {
		const { product_variants, ...raw } = this.props as any
		const rawVariants = product_variants.map((variant) =>
			variant.serialize(),
		)
		raw.product_variants = rawVariants
		return raw
	}

	private props: ProductProps

	protected validate() {
		this.validateVariantUnique()
	}

	private validateVariantUnique() {
		const variantSet = new Set()
		for (const variant of this.props.product_variants) {
			if (variantSet.has(variant.id)) {
				throw new DuplicateProductVariantException(variant.id)
			}
			variantSet.add(variant.id)
		}
	}

	static createProduct(dto: CreateProductDTO) {
		const { isPublished, product_variants, ...props } = dto

		const status = dto.isPublished
			? ProductStatus.Published
			: ProductStatus.Draft

		const variants = dto.product_variants.map((variant) =>
			ProductVariant.create(variant),
		)

		return new Product({
			...props,
			product_variants: variants,
			product_status: status,
		})
	}
}
