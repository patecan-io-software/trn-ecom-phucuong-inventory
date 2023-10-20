import { Inject, Injectable, Logger } from '@nestjs/common'
import mongoose, { Model, Document } from 'mongoose'
import { Category } from '@modules/client/category/domain'
import { CategoryExistsException, CategoryNotFoundException } from '../errors/category.errors'
import { categorySchema } from './models/category.model'
import { Utils } from '@libs'
import { ProductModel } from '@modules/client/product/database'
import { ProductNotFoundException } from '@modules/admin/inventory/errors/product.errors'

const CategoryModel = mongoose.model('Category', categorySchema)

@Injectable()
export class CategoryRepository {
	private logger: Logger = new Logger(CategoryRepository.name)
	constructor() {}

	async searchCategoriesByKeyword(keyword: string) {
		const escapedKeyword = Utils.escapeRegExp(keyword)
		const regexSearch: RegExp = new RegExp(escapedKeyword, 'i') // 'i' for case-insensitive search

		try {
			const query: Record<string, any> = {
				$text: { $search: regexSearch.source },
			}

			const results = await CategoryModel.find(query)
				.sort({ score: { $meta: 'textScore' } }) // Sort by text search score
				.lean()
				.exec()

			return results
		} catch (error) {
			console.error('Error while searching by keyword:', error)
			throw error
		}
	}

	async getById(id: string): Promise<Category> {
		const result = await CategoryModel.findById(id)
			.where({
				isMarkedDelete: false,
			})
			.select('-__v -isMarkedDelete -category_products')
		if (!result) {
			throw new CategoryNotFoundException(id)
		}
		return result.toObject({
			flattenObjectIds: true,
		})
	}

	async find(options: { page: number; page_size: number }): Promise<{
		items: Category[]
		page_size: number
		page: number
		total_page: number
		total_count: number
	}> {
		const { page = 1, page_size = 10 } = options
		const [categoryList, count] = await Promise.all([
			CategoryModel.find({ isMarkedDelete: false })
				.select('-__v -isMarkedDelete -category_products')
				.skip((page - 1) * page_size)
				.limit(page_size)
				.exec(),
			CategoryModel.countDocuments({ isMarkedDelete: false }),
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
