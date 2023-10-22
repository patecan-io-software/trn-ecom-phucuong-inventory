import { DuplicateImageNameException } from '../errors/product.errors'
import { ProductColor, ProductImage, ProductVariantType } from './types'

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

export type UpdateVariantProps = Omit<
	ProductVariantProps,
	'discount_percentage'
>

export type SerializedProductVariant = ProductVariantProps

export class ProductVariant {
	protected props: ProductVariantProps
	protected readonly _variant: string
	protected _variantType: ProductVariantType

	get skuCode() {
		return this.props.sku
	}

	get variantValue() {
		return this._variant
	}

	get variantType() {
		return this._variantType
	}

	serialize(): SerializedProductVariant {
		return this.props
	}

	constructor(props: ProductVariantProps) {
		this.props = props
		this.validate()

		this.updateVariantType()

		this._variant = `${props.color.value}-${props.material}`
	}

	update(props: UpdateVariantProps) {
		const { color, discount_price, image_list, material, price, quantity } =
			props
		this.props.color = color
		this.props.discount_price = discount_price
		this.props.image_list = image_list
		this.props.material = material
		this.props.price = price
		this.props.quantity = quantity
		this.props.discount_percentage = Math.round(
			((price - discount_price) / price) * 100,
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

	protected updateVariantType() {
		const {
			color: { value: colorValue },
			material,
		} = this.props
		if (!colorValue && !material) {
			this._variantType = ProductVariantType.None
			return
		}
		if (!material) {
			this._variantType = ProductVariantType.ColorOnly
			return
		}
		if (!colorValue) {
			this._variantType = ProductVariantType.MaterialOnly
			return
		}
		this._variantType = ProductVariantType.ColorAndMaterial
	}

	static create(props: CreateProductVariantProps) {
		// round to 1 decimal
		const discount_percentage = Math.round(
			((props.price - props.discount_price) / props.price) * 100,
		)
		props.color ||= {
			label: null,
			value: null,
		}
		props.material ||= null
		return new ProductVariant({
			...props,
			discount_percentage,
		})
	}

	static createDefault(
		props: Omit<CreateProductVariantProps, 'color' | 'material'>,
	) {
		return this.create({
			color: {
				label: null,
				value: null,
			},
			material: null,
			...props,
		})
	}

	static generateSKU(sku: string, color: ProductColor, material: string) {
		return `${sku}-${color.value}-${material}`
	}
}
