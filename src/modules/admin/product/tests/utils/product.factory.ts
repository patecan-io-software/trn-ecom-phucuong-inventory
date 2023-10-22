import { CreateProductDTO, ProductVariantType } from '../../domain'
import { ProductVariantFactory } from './product-variant.factory'

export class ProductDTOBuilder {
	private _result: CreateProductDTO

	get result() {
		return this._result
	}

	createProduct() {
		this._result = {
			product_name: '',
			product_description: '',
			product_banner_image: {
				imageName: '',
				imageUrl: '',
			},
			product_brand: '',
			product_categories: [],
			product_height: 0,
			product_width: 0,
			product_length: 0,
			product_size_unit: '',
			product_weight: {
				value: 0,
				unit: '',
			},
			isPublished: false,
			product_variants: [],
		}
		return this
	}

	withOneVariant(variantType: ProductVariantType) {
		this._result.product_variants = [
			ProductVariantFactory.createVariantWithType('SKU01', variantType),
		]
		return this
	}

	withMultipleVariantsOfTheSameType(variantType: ProductVariantType) {
		this._result.product_variants = [
			ProductVariantFactory.createVariantWithType('SKU01', variantType),
			ProductVariantFactory.createVariantWithType('SKU02', variantType),
			ProductVariantFactory.createVariantWithType('SKU03', variantType),
		]
		return this
	}

	withMultipleVariantsOfDifferentType() {
		this._result.product_variants = [
			ProductVariantFactory.createVariantWithType(
				'SKU01',
				ProductVariantType.ColorOnly,
			),
			ProductVariantFactory.createVariantWithType(
				'SKU02',
				ProductVariantType.MaterialOnly,
			),
			ProductVariantFactory.createVariantWithType(
				'SKU03',
				ProductVariantType.ColorAndMaterial,
			),
		]
		return this
	}

	withDuplicateVariantSKU(sku: string) {
		this._result.product_variants = [
			ProductVariantFactory.createVariantWithType(
				sku,
				ProductVariantType.ColorAndMaterial,
			),
			ProductVariantFactory.createVariantWithType(
				sku,
				ProductVariantType.ColorAndMaterial,
			),
		]
		return this
	}

	withDuplicateVariantValue(color: string, material: string) {
		this._result.product_variants = [
			ProductVariantFactory.createVariantWithVariantValue(
				'SKU01',
				color,
				material,
			),
			ProductVariantFactory.createVariantWithVariantValue(
				'SKU02',
				color,
				material,
			),
			ProductVariantFactory.createVariantWithVariantValue(
				'SKU03',
				color,
				material,
			),
		]
		return this
	}
}
