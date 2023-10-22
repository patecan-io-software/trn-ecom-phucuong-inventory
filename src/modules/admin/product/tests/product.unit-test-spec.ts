import { Product, ProductVariantType } from '../domain'
import {
	DuplicateProductVariantException,
	InvalidProductVariantTypeException,
} from '../errors/product.errors'
import { ProductDTOBuilder } from './utils/product.factory'

describe('Product', () => {
	describe('When a product is created', () => {
		describe('If product has only one variant', () => {
			it('Success if variant value exists', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(ProductVariantType.ColorAndMaterial).result

				const product = Product.createProduct(productDTO)
				expect(product.variantType).toEqual(ProductVariantType.None)
			})

			it('Success if variant type is None', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(ProductVariantType.None).result

				const product = Product.createProduct(productDTO)

				expect(product.variantType).toEqual(ProductVariantType.None)
			})
		})

		describe('If product has multiple variants', () => {
			it('Throw error if product has variant type of None', () => {
				const productDTOBuilder = new ProductDTOBuilder()
				const productDTO = productDTOBuilder
					.createProduct()
					.withMultipleVariantsOfTheSameType(
						ProductVariantType.None,
					).result

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
