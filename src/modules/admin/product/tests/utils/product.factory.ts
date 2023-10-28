import {
	CreateProductDTO,
	ProductVariantStatus,
	ProductVariantType,
} from '../../domain'
import { ProductVariantFactory } from './product-variant.factory'

export class ProductDTOBuilder {
	private _result: CreateProductDTO

	get result() {
		return this._result
	}

	createProduct(isPublished = true) {
		this._result = {
			product_name: '',
			product_description: '',
			product_banner_image: '',
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
			isPublished,
			product_variants: [],
		}
		return this
	}

	withBannerImage(imageUrl: string) {
		this._result.product_banner_image = imageUrl
		return this
	}

	withOneVariant(variantType: ProductVariantType) {
		this._result.product_variants.push(
			ProductVariantFactory.createVariantWithType('SKU01', variantType),
		)
		this._result.product_banner_image =
			this._result.product_variants[0].image_list[0].imageUrl

		return this
	}

	withVariantStatus(status: ProductVariantStatus) {
		this._result.product_variants.forEach((variant) => {
			variant.status = status
		})
		return this
	}

	withMultipleVariantsOfTheSameType(variantType: ProductVariantType) {
		this._result.product_variants = [
			ProductVariantFactory.createVariantWithType('SKU01', variantType),
			ProductVariantFactory.createVariantWithType('SKU02', variantType),
			ProductVariantFactory.createVariantWithType('SKU03', variantType),
		]
		this._result.product_banner_image =
			this._result.product_variants[0].image_list[0].imageUrl

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

		this._result.product_banner_image =
			this._result.product_variants[0].image_list[0].imageUrl

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

		this._result.product_banner_image =
			this._result.product_variants[0].image_list[0].imageUrl

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

		this._result.product_banner_image =
			this._result.product_variants[0].image_list[0].imageUrl

		return this
	}
}
