import { Product, ProductVariantStatus, ProductVariantType } from '../domain'
import {
	DuplicateProductVariantException,
	InsufficientProductVariantException,
	InvalidProductBannerImageException,
	InvalidProductVariantTypeException,
} from '../errors/product.errors'
import { ProductDTOBuilder } from './utils/product.factory'

describe('Product', () => {
	describe('When a product is created', () => {
		describe('If product has no active variant', () => {
			it('Throw error if product status is Published', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct(true)
					.withMultipleVariantsOfTheSameType(
						ProductVariantType.ColorAndMaterial,
					)
					.withVariantStatus(ProductVariantStatus.Inactive).result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(
						InsufficientProductVariantException,
					)
				}
			})

			it('Success if product status is Draft', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct(false)
					.withMultipleVariantsOfTheSameType(
						ProductVariantType.ColorAndMaterial,
					)
					.withVariantStatus(ProductVariantStatus.Inactive).result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeUndefined()
				}
			})
		})

		describe('If product has only one variant', () => {
			it('Success if variant value exists', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(ProductVariantType.ColorAndMaterial).result

				const product = Product.createProduct(productDTO)
				expect(product.variantType).toEqual(
					ProductVariantType.ColorAndMaterial,
				)
			})
		})

		describe('If product has multiple variants', () => {
			it('Throw error if product has different variant types', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withMultipleVariantsOfDifferentType().result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(
						InvalidProductVariantTypeException,
					)
				}
			})

			it('Throw error if product variants have duplicate SKU', () => {
				const productDTOBuilder = new ProductDTOBuilder()
				const productDTO = productDTOBuilder
					.createProduct()
					.withDuplicateVariantSKU('SKU01').result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(
						DuplicateProductVariantException,
					)
				}
			})

			it('Throw error if product variants have duplicate color and material', () => {
				const productDTOBuilder = new ProductDTOBuilder()
				const productDTO = productDTOBuilder
					.createProduct()
					.withDuplicateVariantValue('Red', 'Leather').result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(
						DuplicateProductVariantException,
					)
				}
			})

			it('Throw error if product variants have duplicate color only', () => {
				const productDTOBuilder = new ProductDTOBuilder()
				const productDTO = productDTOBuilder
					.createProduct()
					.withDuplicateVariantValue('Red', null).result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(
						DuplicateProductVariantException,
					)
				}
			})

			it('Throw error if product variants have duplicate material only', () => {
				const productDTOBuilder = new ProductDTOBuilder()
				const productDTO = productDTOBuilder
					.createProduct()
					.withDuplicateVariantValue(null, 'Leather').result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(
						DuplicateProductVariantException,
					)
				}
			})

			it('Otherwise, create product successfully', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withMultipleVariantsOfTheSameType(
						ProductVariantType.ColorOnly,
					).result

				let error
				try {
					const product = Product.createProduct(productDTO)
					expect(product.variantType).toEqual(
						ProductVariantType.ColorOnly,
					)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeUndefined()
				}
			})
		})
	})
})
