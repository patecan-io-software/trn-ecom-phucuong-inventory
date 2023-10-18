import { DuplicateProductVariantException } from '../errors/product.errors'
import { ProductStatus } from './types'

export interface CreateProductDTO {
	product_code: string
	product_name: string
	product_description: string
	product_banner_image: string
	product_type: string
	product_brand: string
	product_categories: string[]
	product_height: number
	product_width: number
	product_length: number
	product_size_unit: string[]
	product_weight: {
		type: number
		value: string
	}
	price: number
	quantity: number
	image_list?: {
		imageName: string
		imageUrl: string
	}[]
	product_variant_list: ProductVariant[]
	isPublished?: boolean
}

export interface ProductVariant {
	sku?: string
	color: string
	material: string
	price: number
	quantity: number
	image_list?: {
		imageName: string
		imageUrl: string
	}[]
}

export class Product {
	constructor(props: any) {
		Object.assign(this, props)
		this.validate()
	}

	public readonly product_code: string
	public readonly product_name: string
	public readonly product_description: string
	public readonly product_banner_image: string
	public readonly product_type: string
	public readonly product_brand: string
	public readonly product_categories: string[]
	public readonly product_variant_list: ProductVariant[]
	public readonly product_status: ProductStatus
	public readonly product_height: number
	public readonly product_width: number
	public readonly product_length: number
	public readonly product_size_unit: string[]
	public readonly product_weight: string[]

	protected validate() {
		this.validateVariant()
	}

	private validateVariant() {
		const variantSet = new Set()
		for (const variant of this.product_variant_list) {
			const key = `${variant.sku}-${variant.color}-${variant.material}`
			if (variantSet.has(key)) {
				throw new DuplicateProductVariantException(key)
			}
			variantSet.add(
				`${variant.sku}-${variant.color}-${variant.material}`,
			)
		}
	}

	private static createDefaultVariant(
		quantity: number,
		price: number,
		image_list: {
			imageName: string
			imageUrl: string
		}[] = [],
	): ProductVariant {
		return {
			color: '*',
			material: '*',
			image_list: image_list || [],
			quantity,
			price,
		}
	}

	static createProduct(dto: CreateProductDTO) {
		const status = dto.isPublished
			? ProductStatus.Published
			: ProductStatus.Draft

		const defaultVariant = Product.createDefaultVariant(
			dto.quantity,
			dto.price,
			dto.image_list || [],
		)
		dto.product_variant_list.push(defaultVariant)

		return new Product({
			...dto,
			status,
		})
	}
}
