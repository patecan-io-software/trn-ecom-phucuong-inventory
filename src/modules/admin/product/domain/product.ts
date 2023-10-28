import {
	DuplicateProductVariantException,
	InsufficientProductVariantException,
	InvalidProductVariantException,
	InvalidProductVariantTypeException,
} from '../errors/product.errors'
import {
	CreateProductVariantProps,
	ProductVariant,
	SerializedProductVariant,
	UpdateVariantProps,
} from './product-variant'
import {
	ProductImage,
	ProductStatus,
	ProductVariantStatus,
	ProductVariantType,
	ProductWeight,
} from './types'

export interface CreateProductDTO {
	product_name: string
	product_description: string
	product_banner_image: string
	product_brand: string
	product_categories: string[]
	product_height: number
	product_width: number
	product_length: number
	product_size_unit: string
	product_weight: ProductWeight
	product_variants: CreateProductVariantProps[]
	isPublished?: boolean
	_id?: string
}

export interface UpdateProductDTO {
	product_name: string
	product_description: string
	product_banner_image: string
	product_brand: string
	product_categories: string[]
	product_height: number
	product_width: number
	product_length: number
	product_size_unit: string
	product_weight: ProductWeight
	product_variants: UpdateVariantProps[]
	isPublished?: boolean
}

export interface ProductProps {
	_id?: string
	product_name: string
	product_description: string
	product_banner_image: string
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

	get variantType() {
		return this.props.product_variants[0].variantType
	}

	setId(id: string) {
		if (this.props._id) {
			return
		}
		this.props._id = id
	}

	update(dto: UpdateProductDTO) {
		if (dto.isPublished !== undefined) {
			this.props.product_status = dto.isPublished
				? ProductStatus.Published
				: ProductStatus.Draft
		}
		dto.product_variants.forEach((updated) => {
			const variant = this.props.product_variants.find(
				(variant) => variant.sku === updated.sku,
			)
			if (!variant) {
				throw new InvalidProductVariantException(updated.sku)
			}

			variant.update(updated)
		})

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
		this.validateVariant()
	}

	private validateVariant() {
		const activeProductVariants = this.props.product_variants.filter(
			(variant) => variant.status === ProductVariantStatus.Active,
		)
		if (
			this.props.product_status === ProductStatus.Published &&
			activeProductVariants.length === 0
		) {
			throw new InsufficientProductVariantException()
		}

		if (activeProductVariants.length === 1) {
			return
		}

		// Remove check for VariantType of None since it is deprecated
		// if (activeProductVariants.length === 1) {
		// 	const variant = this.props.product_variants[0]
		// 	if (variant.variantType !== ProductVariantType.None) {
		// 		throw new InvalidProductVariantTypeException(
		// 			ProductVariantType.None,
		// 			variant.variantType,
		// 		)
		// 	}
		// 	return
		// }

		// if there are multiple variants, SKU must be unique and variant type of all variants must be the same regardless of their status
		const validVariantType = this.props.product_variants[0].variantType
		const variantSet = new Set()
		const skuCodeSet = new Set()
		for (const variant of this.props.product_variants) {
			if (
				variant.variantType !== validVariantType ||
				variant.variantType === ProductVariantType.None
			) {
				throw new InvalidProductVariantTypeException(
					validVariantType,
					variant.variantType,
				)
			}
			if (
				variantSet.has(variant.variantValue) ||
				skuCodeSet.has(variant.sku)
			) {
				throw new DuplicateProductVariantException(
					`${variant.sku}: ${variant.variantValue}`,
				)
			}
			skuCodeSet.add(variant.sku)
			variantSet.add(variant.variantValue)
		}
	}

	static createProduct(dto: CreateProductDTO) {
		const { isPublished, product_variants, ...props } = dto

		const status = isPublished
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
