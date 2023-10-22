import {
	DuplicateProductVariantException,
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
	ProductVariantType,
	ProductWeight,
} from './types'

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
	product_variants: UpdateVariantProps[]
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
			const sku = ProductVariant.generateSKU(
				updated.sku,
				updated.color,
				updated.material,
			)
			const variant = this.props.product_variants.find(
				(variant) => variant.skuCode === sku,
			)
			if (!variant) {
				throw new InvalidProductVariantException(sku)
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
		const productVariants = this.props.product_variants
		if (productVariants.length === 1) {
			if (productVariants[0].variantType !== ProductVariantType.None) {
				throw new InvalidProductVariantTypeException(
					ProductVariantType.None,
					productVariants[0].variantType,
				)
			}
			return
		}
		// if there are multiple variants, SKU must be unique and variant type of all variants must be the same
		const validVariantType = productVariants[0].variantType
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
				skuCodeSet.has(variant.skuCode)
			) {
				throw new DuplicateProductVariantException(
					`${variant.skuCode}: ${variant.variantValue}`,
				)
			}
			skuCodeSet.add(variant.skuCode)
			variantSet.add(variant.variantValue)
		}
	}

	static createProduct(dto: CreateProductDTO) {
		const { isPublished, product_variants, ...props } = dto

		const status = dto.isPublished
			? ProductStatus.Published
			: ProductStatus.Draft

		let variants: any[]
		if (dto.product_variants.length === 1) {
			const variant = dto.product_variants[0]
			const defaultVariant = ProductVariant.createDefault({
				discount_price: variant.discount_price,
				price: variant.price,
				quantity: variant.quantity,
				sku: variant.sku,
				image_list: variant.image_list,
			})
			variants = [defaultVariant]
		} else {
			variants = dto.product_variants.map((variant) =>
				ProductVariant.create(variant),
			)
		}

		return new Product({
			...props,
			product_variants: variants,
			product_status: status,
		})
	}
}
