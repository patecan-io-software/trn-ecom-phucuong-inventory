import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'
import { Category, categorySchema } from './models/category.model'
import { IPaginationResult, Utils } from '@libs'

const CategoryModel = mongoose.model('Category', categorySchema)

@Injectable()
export class CategoryRepository {
	constructor() {}

	async getById(id: string): Promise<Category> {
		const result = await CategoryModel.findById(id)
			.where({
				isMarkedDelete: false,
			})
			.select(this.getSelectFields())
		if (!result) {
			return null
		}
		return result.toObject({
			flattenObjectIds: true,
		})
	}

	async findAll(): Promise<Category[]> {
		const result = await CategoryModel.find()
			.where({
				isMarkedDelete: false,
			})
			.select(this.getSelectFields())
		return result.map((cat) =>
			cat.toObject({
				flattenObjectIds: true,
			}),
		)
	}

	async find(options: {
		page: number
		page_size: number
		q: string
	}): Promise<IPaginationResult> {
		const { page = 1, page_size = 10, q } = options
		const query: Record<string, any> = {
			isMarkedDelete: false,
		}
		if (q) {
			const escapedKeyword = Utils.escapeRegExp(q)
			const regexSearch: RegExp = new RegExp(escapedKeyword, 'i') // 'i' for case-insensitive search
			query.$text = { $search: regexSearch.source }
		}

		const findCatetoriesQuery = CategoryModel.find(query)
			.select(this.getSelectFields())
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * page_size)
			.limit(page_size)

		q && findCatetoriesQuery.where({ $text: { $search: q } })

		const [categoryList, count] = await Promise.all([
			findCatetoriesQuery.exec(),
			CategoryModel.countDocuments(query),
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

	private getSelectFields() {
		return '-__v -isMarkedDelete -category_products -createdAt -updatedAt -category_isActive'
	}
}
