import { Injectable, Logger } from '@nestjs/common'
import { ProductModel } from './models/product.model'
import { CategoryModel } from './models/category.model'
import { Product } from '../domain'
import slugify from 'slugify'
import { BrandModel } from './models/brand.model'
import { CategoryNotFoundException } from '../errors/category.errors'
import { BrandNotFoundException } from '../errors/brand.errors'
import {
	CreateProductFailedException,
	SkuAlreadyExistsException,
} from '../errors/product.errors'
import { InventoryModel } from './models/inventory.model'
import { ProductVariant } from '../domain/product-variant'
import { Utils } from '@libs'
import { ProductMaterial, ProductMaterialModel } from './models/material.model'
import mongoose from 'mongoose'

@Injectable()
export class InventoryRepository {
	private readonly logger = new Logger(InventoryRepository.name)

	async doesInventoryExists(skuIds: string[]): Promise<string[]> {
		const inventoryList = await InventoryModel.find({
			sku: { $in: skuIds },
		})
			.select('sku')
			.exec()
		return inventoryList.map((inventory) => inventory.inventory_sku)
	}

	async save(product: Product): Promise<Product> {
		console.log('#3');
		const raw = product.serialize()
		const [categoryList, brand, existingSkuList] = await Promise.all([
			CategoryModel.find()
				.where({
					_id: {
						$in: raw.product_categories,
					},
					isMarkedDelete: false,
				})
				.select('category_name category_logoUrl')
				.exec(),
			BrandModel.findById(raw.product_brand)
				.select('brand_name brand_logoUrl')
				.exec(),
			InventoryModel.find({
				sku: {
					$in: raw.product_variants.map((variant) => variant.sku),
				},
			})
				.select('sku')
				.exec(),
		])
		if (categoryList.length < raw.product_categories.length) {
			const missingCategoryIds = raw.product_categories.filter(
				(categoryId) =>
					!categoryList.some((category) =>
						category._id.equals(categoryId),
					),
			)
			throw new CategoryNotFoundException(missingCategoryIds)
		}
		if (!brand) {
			throw new BrandNotFoundException(raw.product_brand)
		}
		if (existingSkuList.length > 0) {
			throw new SkuAlreadyExistsException(
				existingSkuList.map((sku) => sku.inventory_sku),
			)
		}
		const model = new ProductModel({
			product_slug: slugify(raw.product_name, {
				lower: true,
			}),
			product_name: raw.product_name,
			product_description: raw.product_description,
			product_banner_image: raw.product_banner_image,
			product_brand: brand.toObject({}),
			product_categories: categoryList.map((cate) => cate.toObject()),
			product_variant_list: raw.product_variants,
			product_weight: raw.product_weight,
			product_height: raw.product_height,
			product_width: raw.product_width,
			product_length: raw.product_length,
			product_size_unit: raw.product_size_unit,
			product_status: raw.product_status,
			product_variants: raw.product_variants,
			product_isActive: true,
			isMarkedDelete: false,
		})
		try {
			const result = await model.save()
			const materialList = result.product_variants.map((variant) => ({
				material_name: variant.material,
			}))
			await this.batchSaveMaterials(materialList)
			return result.toObject({
				versionKey: false,
				flattenObjectIds: true,
				transform: (doc, ret) => {
					delete ret.__v
					delete ret.isMarkedDelete
				},
			})
		} catch (error) {
			this.logger.error(error)
			throw new CreateProductFailedException()
		}
	}

	async getProductById(id: string) {
		const product = await ProductModel.findById(id).exec()
		if (!product) {
			return null
		}
		const raw = product.toObject({
			versionKey: false,
			depopulate: true,
		})
		return new Product({
			...raw,
			product_variants: raw.product_variants.map(
				(variant) => new ProductVariant(variant as any),
			),
		} as any)
	}

	async deleteProductById(id: string) {
		const product = await ProductModel.findById(id).exec()
		if (!product) {
			return null
		}

		product.isMarkedDelete = true
		product.product_categories = []
		product.product_brand = null
		const skuIds = product.product_variants.map((variant) => variant.sku)

		for (const skuId of skuIds) {
			const inventory = await InventoryModel.findOne({
				sku: skuId,
			}).exec()
			if (inventory) {
				inventory.isMarkedDelete = true
				await inventory.save()
			}
		}

		return await product.save()
	}

	async searchProductsByKeyword(keyword: string) {
		const escapedKeyword = Utils.escapeRegExp(keyword)
		const regexSearch: RegExp = new RegExp(escapedKeyword, 'i') // 'i' for case-insensitive search

		try {
			const query: Record<string, any> = {
				$text: { $search: regexSearch.source },
			}

			const results = await ProductModel.find(query)
				.exec()

			return results
		} catch (error) {
			console.error('Error while searching by keyword:', error)
			throw error
		}
	}

	async batchSaveMaterials(
		materials: Omit<ProductMaterial, '_id'>[],
	): Promise<void> {
		const materialRawList = materials.map(
			(material) =>
				new ProductMaterialModel({
					_id: new mongoose.Types.ObjectId(),
					...material,
				}),
		)
		try {
			await Promise.all(
				materialRawList.map((material) => material.save()),
			)
		} catch (error) {
			this.logger.warn(error)
		}
	}

	async findMaterials(options: {
		material_name: string
		page: number
		page_size: number
	}): Promise<{
		items: ProductMaterial[]
		page_size: number
		page: number
		total_page: number
		total_count: number
	}> {
		const { page = 1, page_size = 10, material_name } = options
		const filter = {
			isMarkedDelete: false,
			...(material_name && {
				$text: { $search: material_name },
			}),
		}
		const [categoryList, count] = await Promise.all([
			ProductMaterialModel.find(filter)
				.select('-__v -isMarkedDelete')
				.skip((page - 1) * page_size)
				.limit(page_size)
				.exec(),
			ProductMaterialModel.countDocuments(filter),
		])

		return {
			items: categoryList.map((cat) =>
				cat.toObject({
					flattenObjectIds: true,
				}),
			),
			page: page,
			page_size: page_size,
			total_page: Math.ceil(count / page_size),
			total_count: count,
		}
	}
}
