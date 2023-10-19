import { Injectable, Logger } from '@nestjs/common'
import { ProductModel } from './models/product.model'
import { Product } from '@modules/client/product/domain'
import { Utils } from '@libs'

@Injectable()
export class ProductRepository {
	private readonly logger = new Logger(ProductRepository.name)


	async searchProductsByKeyword(keyword: string) {
		const escapedKeyword = Utils.escapeRegExp(keyword)
		const regexSearch: RegExp = new RegExp(escapedKeyword, 'i') // 'i' for case-insensitive search

		try {
			const query: Record<string, any> = {
				$text: { $search: regexSearch.source },
			}

			const results = await ProductModel
				.find(query)
				.sort({ score: { $meta: 'textScore' } }) // Sort by text search score
				.lean()
				.exec()

			return results
		} catch (error) {
			console.error('Error while searching by keyword:', error)
			throw error
		}
	}


	async find(
		options: {
			page: number;
			page_size: number;
			category: string;
			brand: string;
			priceMin: number;
			priceMax: number;
			filters: Record<string, any>;
		}): Promise<{
		items: Product[]
		page_size: number
		page: number
		total_page: number
		total_count: number
	}> {
		const {
			page = 1, page_size = 10, category, brand, priceMin, priceMax, filters,
		} = options
		const query = {
			isMarkedDelete: false, // Default filter
			...filters, // Additional filter options
		}

		if (category) {
			query['product_categories._id'] = category
		}
		if (brand) {
			query['product_brand._id'] = brand
		}


		const [productsList, count] = await Promise.all([
			ProductModel
				.find(query)
				.select('-__v -isMarkedDelete -category_products')
				.skip((page - 1) * page_size)
				.limit(page_size)
				.exec(),

			ProductModel.countDocuments({ isMarkedDelete: false }),
		])

		return {
			items: productsList.map((product) =>
				product.toObject({
					flattenObjectIds: true,
				}),
			),
			page: page,
			page_size: page_size,
			total_page: Math.ceil(count / page_size),
			total_count: count,
		}
	}

	async findByCategoryId(categoryId: string, options: {
		page: number;
		page_size: number;
		filters: Record<string, any>;
	}): Promise<{
		items: Product[]
		page_size: number
		page: number
		total_page: number
		total_count: number
	}> {
		const { page = 1, page_size = 10, filters } = options
		const query = {
			'product_categories._id': Utils.convertStringIdToObjectId(categoryId),
			isMarkedDelete: false, // Default filter
			...filters, // Additional filter options
		}

		const [productsList, count] = await Promise.all([
			ProductModel
				.find(query)
				.select('-__v -isMarkedDelete')
				.skip((page - 1) * page_size)
				.limit(page_size)
				.exec(),

			ProductModel.countDocuments(query),
		])

		return {
			items: productsList.map((product) =>
				product.toObject({
					flattenObjectIds: true,
				}),
			),
			page: page,
			page_size: page_size,
			total_page: Math.ceil(count / page_size),
			total_count: count,
		}
	}


	async findByBrandId(brandId: string, options: {
		page: number;
		page_size: number;
		filters: Record<string, any>;
	}): Promise<{
		items: Product[]
		page_size: number
		page: number
		total_page: number
		total_count: number
	}> {
		const { page = 1, page_size = 10, filters } = options
		const query = {
			'product_brand._id': Utils.convertStringIdToObjectId(brandId),
			isMarkedDelete: false, // Default filter
			...filters, // Additional filter options
		}

		const [productsList, count] = await Promise.all([
			ProductModel
				.find(query)
				.select('-__v -isMarkedDelete')
				.skip((page - 1) * page_size)
				.limit(page_size)
				.exec(),

			ProductModel.countDocuments(query),
		])

		return {
			items: productsList.map((product) =>
				product.toObject({
					flattenObjectIds: true,
				}),
			),
			page: page,
			page_size: page_size,
			total_page: Math.ceil(count / page_size),
			total_count: count,
		}
	}

	async getById(id: string): Promise<Product> {
		const result = await ProductModel.findById(id)
			.where({
				isMarkedDelete: false,
			})
			.where({
				isDraft: false,
			})
			.select('-__v -isMarkedDelete')
		return result.toObject({
			flattenObjectIds: true,
		})
	}
}
