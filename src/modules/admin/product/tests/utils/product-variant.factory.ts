import {
	CreateProductVariantProps,
	ProductVariantStatus,
	ProductVariantType,
} from '../../domain'
import { getRandomAlphabetString, getRandomProductColor } from './random'

export class ProductVariantFactory {
	static createVariantWithType(
		sku: string,
		variantType: ProductVariantType,
		status: ProductVariantStatus = ProductVariantStatus.Active,
	): CreateProductVariantProps {
		const imageName = getRandomAlphabetString(10)
		const props: CreateProductVariantProps = {
			sku,
			quantity: 1,
			price: 5000,
			discount_price: 5000,
			image_list: [
				{
					imageName: `temp/${imageName}`,
					imageUrl: `http://example/products/test/${imageName}`,
				},
			],
			color: null,
			material: null,
			status,
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
		const imageName = getRandomAlphabetString(10)
		const props: CreateProductVariantProps = {
			sku,
			quantity: 1,
			price: 5000,
			discount_price: 5000,
			image_list: [
				{
					imageName: `temp/${imageName}`,
					imageUrl: `http://example/products/test/${imageName}`,
				},
			],
			color: {
				label: getRandomAlphabetString(5),
				value: color,
			},
			material: material,
		}
		return props
	}
}
