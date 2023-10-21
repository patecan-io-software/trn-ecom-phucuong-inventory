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

export type UpdateVariantProps = Omit<ProductVariantProps, 'discount_percentage'>

export type SerializedProductVariant = ProductVariantProps

export class ProductVariant {
	protected props: ProductVariantProps

	get sku() {
		const { sku, color, material } = this.props
		return `${sku}-${color.value}-${material}`
	}

	serialize(): SerializedProductVariant {
		return this.props
	}

	constructor(props: ProductVariantProps) {
		this.props = props
		this.validate()
	}

	update(props: UpdateVariantProps) {
		const { color, discount_price, image_list, material, price, quantity } = props
		this.props.color = color
		this.props.discount_price = discount_price
		this.props.image_list = image_list
		this.props.material = material
		this.props.price = price
		this.props.quantity = quantity
		this.props.discount_percentage = Math.round(
			(price - discount_price) / price * 100
		)
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
		const discount_percentage = Math.round(
			(props.price - props.discount_price) / props.price * 100
		)
		return new ProductVariant({
			...props,
			discount_percentage,
		})
	}

	static generateSKU(sku: string, color: ProductColor, material: string) {
		return `${sku}-${color.value}-${material}`
	}
}
