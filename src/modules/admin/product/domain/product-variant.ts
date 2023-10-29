import {
	DuplicateImageNameException,
	InvalidDiscountPriceException,
} from '../errors/product.errors'
import {
	ProductColor,
	ProductImage,
	ProductVariantStatus,
	ProductVariantType,
} from './types'

export interface ProductVariantProps {
	sku: string
	color: ProductColor
	material: string
	price: number
	discount_price: number
	discount_percentage: number
	quantity: number
	image_list: ProductImage[]
	status?: ProductVariantStatus
}

export type CreateProductVariantProps = Omit<
	ProductVariantProps,
	'discount_percentage'
>

export type UpdateVariantProps = Omit<
	ProductVariantProps,
	'discount_percentage'
>

export type SerializedProductVariant = ProductVariantProps

export class ProductVariant {
	protected props: ProductVariantProps
	protected _variant: string
	protected _variantType: ProductVariantType

	get sku() {
		return this.props.sku
	}

	get variantValue() {
		return this._variant
	}

	get variantType() {
		return this._variantType
	}

	get status() {
		return this.props.status
	}

	serialize(): SerializedProductVariant {
		return this.props
	}

	constructor(props: ProductVariantProps) {
		this.props = props
		this.validate()

		this.updateVariantType()
	}

	update(props: UpdateVariantProps) {
		const { color, discount_price, image_list, material, price, quantity } =
			props
		this.props.color = color
		this.props.discount_price = discount_price || price
		this.props.image_list = image_list
		this.props.material = material
		this.props.price = price
		this.props.quantity = quantity
		this.props.discount_percentage = Math.round(
			((price - this.props.discount_price) / price) * 100,
		)

		this.updateVariantType()
	}

	protected validate() {
		const imageSet = new Set()
		const { price, discount_price } = this.props
		if (discount_price > price) {
			throw new InvalidDiscountPriceException(price, discount_price)
		}
		this.props.image_list.forEach((image) => {
			if (imageSet.has(image.imageName)) {
				throw new DuplicateImageNameException(image.imageName)
			}
			imageSet.add(image.imageName)
		})
	}

	protected updateVariantType() {
		const { color, material } = this.props
		if (!color && !material) {
			this._variantType = ProductVariantType.None
			this._variant = null
			return
		}
		if (!material) {
			this._variantType = ProductVariantType.ColorOnly
			this._variant = color.value
			return
		}
		if (!color) {
			this._variantType = ProductVariantType.MaterialOnly
			this._variant = material
			return
		}
		this._variantType = ProductVariantType.ColorAndMaterial
		this._variant = `${color.value}-${material}`
	}

	static create(props: CreateProductVariantProps) {
		// round to 1 decimal
		const discount_percentage = Math.round(
			((props.price - props.discount_price) / props.price) * 100,
		)
		props.color ||= null
		props.material ||= null
		props.status ||= ProductVariantStatus.Active

		return new ProductVariant({
			...props,
			discount_percentage,
		})
	}

	static createVariantNone(
		props: Omit<CreateProductVariantProps, 'color' | 'material'>,
	) {
		return this.create({
			color: null,
			material: null,
			...props,
		})
	}
}
