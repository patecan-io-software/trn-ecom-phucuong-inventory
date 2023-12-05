import { NONE_VARIANT, Product, ProductVariantStatus } from '../domain'
import {
	DuplicateProductVariantException,
	InsufficientProductVariantException,
	InvalidDiscountPriceException,
	InvalidProductVariantTypeException,
} from '../errors/product.errors'
import { ProductVariantFactory } from './utils/product-variant.factory'
import { ProductDTOBuilder } from './utils/product.factory'

describe('Product', () => {
	describe('When a product is created', () => {
		describe('Test discount percentage', () => {
			it('Throw InvalidDiscountPriceException if any variant has discount price bigger than price', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(100, 200).result

				let error
				try {
					Product.createProduct(productDTO)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(InvalidDiscountPriceException)
				}
			})

			it('Price is 0', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(0, 100).result

				const product = Product.createProduct(productDTO)
				const data = product.serialize()
				expect(data.product_variants[0].discount_percentage).toEqual(0)
			})

			it('Price and discount price are equal and not 0', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(200, 200).result

				const product = Product.createProduct(productDTO)
				const data = product.serialize()
				expect(data.product_variants[0].discount_percentage).toEqual(0)
			})

			it('Price and discount_price are not equal', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(200, 100).result

				const product = Product.createProduct(productDTO)
				const data = product.serialize()
				expect(data.product_variants[0].discount_percentage).toEqual(50)
			})
		})

		describe('If product has no active variant', () => {
			it('Throw InsufficientProductVariantException if product status is Published', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct(true)
					.withOneVariant(
						['color'],
						ProductVariantStatus.Inactive,
					).result

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
					.withOneVariant(
						['color'],
						ProductVariantStatus.Inactive,
					).result

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
			it('Success if property list in variant is empty', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant([], ProductVariantStatus.Active).result

				const product = Product.createProduct(productDTO)

				expect(product.variantType).toEqual(NONE_VARIANT.type)
			})

			it('Success if property list is not empty', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(
						['color'],
						ProductVariantStatus.Active,
					).result

				const product = Product.createProduct(productDTO)
				expect(product.variantType).toEqual('color')
			})
		})

		describe('If product has multiple variants', () => {
			it('Throw InvalidProductVariantTypeException if product has different variant types', () => {
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

			it('Throw DuplicateProductVariantException if product variants have duplicate SKU', () => {
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

			it('Throw DuplicateProductVariantException if product variants have duplicated variant value', () => {
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

			it('Otherwise, create product successfully', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withVariant('SKU01', ['color', 'material', 'measurement'])
					.withVariant('SKU02', ['color', 'material', 'measurement'])
					.withVariant('SKU03', [
						'color',
						'material',
						'measurement',
					]).result

				let error
				try {
					const product = Product.createProduct(productDTO)
					expect(product.variantType).toContain('color')
					expect(product.variantType).toContain('material')
					expect(product.variantType).toContain('measurement')
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeUndefined()
				}
			})
		})
	})

	describe('When a product is updated', () => {
		describe('Test update variant property', () => {
			it('Update color', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color']).result

				const product = Product.createProduct(productDTO)

				const variantList = productDTO.product_variants
				variantList[0].color = {
					value: 'update color value',
					label: 'update color label',
				}

				product.updateVariants(variantList)

				const data = product.serialize()
				expect(data.product_variants[0].property_list[0]).toEqual({
					key: 'color',
					value: 'update color value',
				})
				expect(data.product_variants[0].metadata).toHaveProperty(
					'color',
					{
						value: 'update color value',
						label: 'update color label',
					},
				)
			})

			it('Update material', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['material']).result

				const product = Product.createProduct(productDTO)

				productDTO.product_variants[0].material = 'update material'
				product.updateVariants(productDTO.product_variants)

				const data = product.serialize()
				expect(data.product_variants[0].property_list[0]).toEqual({
					key: 'material',
					value: 'update material',
				})
				expect(data.product_variants[0].metadata).toHaveProperty(
					'material',
					'update material',
				)
			})

			it('Update measurement', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['measurement']).result

				const product = Product.createProduct(productDTO)

				productDTO.product_variants[0].measurement = {
					height: 1,
					length: 1,
					width: 5,
					weight: 1,
					sizeUnit: 'cm',
					weightUnit: 'kg',
				}
				product.updateVariants(productDTO.product_variants)

				const data = product.serialize()
				expect(data.product_variants[0].property_list[0]).toEqual({
					key: 'measurement',
					value: '5x1x1(cm)|1(kg)',
				})
				expect(data.product_variants[0].metadata).toHaveProperty(
					'measurement',
					{
						height: 1,
						length: 1,
						width: 5,
						weight: 1,
						sizeUnit: 'cm',
						weightUnit: 'kg',
					},
				)
			})
		})

		describe('Test update variant list', () => {
			it('Add new variant when updating product', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withVariant('SKU01', ['color'])
					.withVariant('SKU02', ['color']).result

				const product = Product.createProduct(productDTO)

				productDTO.product_variants.push(
					ProductVariantFactory.createVariant(
						'SKU03',
						['color'],
						ProductVariantStatus.Active,
					),
				)
				const {
					newVariantList,
					updatedVariantList,
					deletedVariantList,
				} = product.updateVariants(productDTO.product_variants)

				const totalResutlCount =
					newVariantList.length +
					updatedVariantList.length +
					deletedVariantList.length

				expect(totalResutlCount).toEqual(3)
				expect(newVariantList.length).toEqual(1)
				expect(newVariantList[0]).toHaveProperty('sku', 'SKU03')
			})

			it('Update variant when updating product', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withVariant('SKU01', ['color'])
					.withVariant('SKU02', ['color']).result

				const product = Product.createProduct(productDTO)

				productDTO.product_variants[0].color = {
					value: 'Red',
					label: 'Red',
				}
				const {
					newVariantList,
					updatedVariantList,
					deletedVariantList,
				} = product.updateVariants(productDTO.product_variants)

				const totalResutlCount =
					newVariantList.length +
					updatedVariantList.length +
					deletedVariantList.length

				expect(totalResutlCount).toEqual(2)
				expect(updatedVariantList.length).toEqual(2) // if no variant is deleted or added, updatedVariantList will contain all variants
			})

			it('Delete variant when updating product', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withVariant('SKU01', ['color'])
					.withVariant('SKU02', ['color']).result

				const product = Product.createProduct(productDTO)

				// remove SKU02
				productDTO.product_variants = productDTO.product_variants.slice(
					0,
					1,
				)
				const {
					newVariantList,
					updatedVariantList,
					deletedVariantList,
				} = product.updateVariants(productDTO.product_variants)

				const totalResutlCount =
					newVariantList.length +
					updatedVariantList.length +
					deletedVariantList.length

				expect(totalResutlCount).toEqual(2)
				expect(deletedVariantList.length).toEqual(1)
				expect(deletedVariantList[0]).toHaveProperty('sku', 'SKU02')
			})
		})

		describe('Test update product variant price', () => {
			it('Throw InvalidDiscountPriceException if any variant has discount price bigger than price', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(100, 100).result

				const product = Product.createProduct(productDTO)

				let error
				try {
					productDTO.product_variants[0].discount_price = 300
					product.updateVariants(productDTO.product_variants)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeInstanceOf(InvalidDiscountPriceException)
				}
			})

			it('Price is 0', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(100, 100).result

				const product = Product.createProduct(productDTO)

				productDTO.product_variants[0].price = 0
				product.updateVariants(productDTO.product_variants)

				const data = product.serialize()
				expect(data.product_variants[0].discount_percentage).toEqual(0)
				expect(data.product_variants[0].discount_price).toEqual(0)
			})

			it('Price and discount price are equal and not 0', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(200, 200).result

				const product = Product.createProduct(productDTO)

				let error
				try {
					productDTO.product_variants[0].discount_price = 200
					product.updateVariants(productDTO.product_variants)

					const data = product.serialize()
					expect(
						data.product_variants[0].discount_percentage,
					).toEqual(0)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeUndefined()
				}
			})

			it('Price and discount_price are not equal', () => {
				const productDTOBuilder = new ProductDTOBuilder()

				const productDTO = productDTOBuilder
					.createProduct()
					.withOneVariant(['color'])
					.withPrice(200, 100).result

				const product = Product.createProduct(productDTO)

				let error
				try {
					productDTO.product_variants[0].discount_price = 150
					product.updateVariants(productDTO.product_variants)

					const data = product.serialize()
					expect(
						data.product_variants[0].discount_percentage,
					).toEqual(25)
				} catch (e) {
					error = e
				} finally {
					expect(error).toBeUndefined()
				}
			})
		})
	})
})
