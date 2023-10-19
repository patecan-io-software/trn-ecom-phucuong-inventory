import { DuplicateImageNameException } from '../errors/product.errors'
import { ProductColor, ProductImage } from './types'

export interface ProductVariantProps {
	sku: string
	color: ProductColor
	material: string
	price: number
	discount_price: number
	discount_percentage: number
	quantity: number
	image_list: ProductImage[]
}

export type CreateProductVariantProps = Omit<
	ProductVariantProps,
	'discount_percentage'
>

export type SerializedProductVariant = ProductVariantProps

export class ProductVariant {
	protected props: ProductVariantProps

	get id() {
		const { sku, color, material } = this.props
		return `${sku}-${color}-${material}`
	}

	serialize(): SerializedProductVariant {
		return this.props
	}

	constructor(props: ProductVariantProps) {
		this.props = props
		this.validate()
	}

	protected validate() {
		const imageSet = new Set()
		this.props.image_list.forEach((image) => {
			if (imageSet.has(image.imageName)) {
				throw new DuplicateImageNameException(image.imageName)
			}
			imageSet.add(image.imageName)
		})
	}

	static create(props: CreateProductVariantProps) {
		// round to 1 decimal
		const discount_percentage =
			Math.round(props.price - props.discount_price) / props.price
		return new ProductVariant({
			...props,
			discount_percentage,
		})
	}
}
