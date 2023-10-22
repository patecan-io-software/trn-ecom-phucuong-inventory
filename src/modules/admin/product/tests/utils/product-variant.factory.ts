import {
	CreateProductDTO,
	CreateProductVariantProps,
	ProductVariantType,
} from '../../domain'
import {
	getRandomAlphabetString,
	getRandomColor,
	getRandomProductColor,
} from './random'

export class ProductVariantFactory {
	static createVariantWithType(
		sku: string,
		variantType: ProductVariantType,
	): CreateProductVariantProps {
		const props: CreateProductVariantProps = {
			sku,
			quantity: 1,
			price: 5000,
			discount_price: 5000,
			image_list: [],
			color: null,
			material: null,
		}
		switch (variantType) {
			case ProductVariantType.None:
				return props
			case ProductVariantType.ColorOnly:
				props.color = getRandomProductColor()
				return props
			case ProductVariantType.MaterialOnly:
				props.material = getRandomAlphabetString(10)
				return props
			case ProductVariantType.ColorAndMaterial:
				props.color = getRandomProductColor()
				props.material = getRandomAlphabetString(10)
				return props
		}
	}

	static createVariantWithVariantValue(
		sku: string,
		color?: string,
		material?: string,
	) {
		const props: CreateProductVariantProps = {
			sku,
			quantity: 1,
			price: 5000,
			discount_price: 5000,
			image_list: [],
			color: {
				label: getRandomAlphabetString(5),
				value: color,
			},
			material: material,
		}
		return props
	}
}
