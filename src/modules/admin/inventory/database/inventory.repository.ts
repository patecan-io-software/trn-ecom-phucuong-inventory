import { Injectable, Logger } from '@nestjs/common'
import { ProductModel } from './models/product.model'
import { CategoryModel } from './models/category.model'
import { Product } from '../domain'
import slugify from 'slugify'
import { BrandModel } from './models/brand.model'
import { CategoryNotFoundException } from '../errors/category.errors'
import { BrandNotFoundException } from '../errors/brand.errors'
import { CreateProductFailedException } from '../errors/product.errors'

@Injectable()
export class InventoryRepository {
	private readonly logger = new Logger(InventoryRepository.name)
	async createProduct(product: Product) {
		const [categoryList, brand] = await Promise.all([
			CategoryModel.find()
				.where({
					_id: {
						$in: product.product_categories,
					},
					isMarkedDelete: false,
				})
				.select('category_name category_logoUrl')
				.exec(),
			BrandModel.findById(product.product_brand)
				.select('brand_name brand_logoUrl')
				.exec(),
		])
		if (categoryList.length < product.product_categories.length) {
			const missingCategoryId = product.product_categories.find(
				(categoryId) =>
					!categoryList.some((category) =>
						category._id.equals(categoryId),
					),
			)
			throw new CategoryNotFoundException(missingCategoryId)
		}
		if (!brand) {
			throw new BrandNotFoundException(product.product_brand)
		}
		const model = new ProductModel({
			product_code: product.product_code,
			product_slug: slugify(product.product_name),
			product_name: product.product_name,
			product_description: product.product_description,
			product_banner_image: product.product_banner_image,
			product_type: product.product_type,
			product_brand: brand.toObject({}),
			product_categories: categoryList.map((cate) => cate.toObject()),
			product_variant_list: product.product_variant_list,
			product_height: product.product_height,
			product_width: product.product_width,
			product_length: product.product_length,
			product_size_unit: product.product_size_unit,
			product_status: product.product_status,
		})
		try {
			const result = await model.save()
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
}
