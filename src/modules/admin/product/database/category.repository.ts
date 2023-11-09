import { Injectable, Logger } from '@nestjs/common'
import mongoose from 'mongoose'
import {
	CategoryExistsException,
	CategoryNotFoundException,
} from '../errors/category.errors'
import { Category, CategoryModel } from './models/category.model'
import { Utils, isNullOrUndefined } from '@libs'
import { MongoDBErrorHandler } from '@infras/mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CATEGORY_EVENTS } from '../constants'

@Injectable()
export class CategoryRepository {
	private logger: Logger = new Logger(CategoryRepository.name)
	constructor(private readonly eventEmitter: EventEmitter2) {}

	genId() {
		return new mongoose.Types.ObjectId().toHexString()
	}

	onChanged(handle: any) {
		CategoryModel.watch().on('change', (data) => {
			console.log(data)
		})
	}

	async create(category: Category): Promise<Category> {
		const cat = new CategoryModel({
			_id: category._id
				? new mongoose.Types.ObjectId(category._id)
				: new mongoose.Types.ObjectId(),
			...category,
		})
		try {
			const result = await cat.save()

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
			throw new CategoryExistsException(category.category_name)
		}
	}

	async getNonExistCategoryNames(categoryIds: string[]): Promise<string[]> {
		const existingList = await CategoryModel.find({
			_id: {
				$in: categoryIds,
			},
		})
			.select('_id')
			.exec()
		if (existingList.length !== categoryIds.length) {
			return []
		}
		return categoryIds.filter((id) => {
			return (
				existingList.findIndex((category) =>
					category._id.equals(id),
				) === -1
			)
		})
	}

	async getById(id: string): Promise<Category> {
		const result = await CategoryModel.findById(id)
			.where({
				isMarkedDelete: false,
			})
			.populate({
				path: 'parent_category',
				select: '_id category_name category_description',
			})
			.populate('child_category_count')
			.select('-__v -isMarkedDelete -category_products')

		if (!result) {
			return null
		}

		return result.toObject({
			flattenObjectIds: true,
		})
	}

	async update(category: Category): Promise<Category> {
		try {
			const model = new CategoryModel(category)
			model.isNew = false
			await model.save()

			this.eventEmitter.emitAsync(CATEGORY_EVENTS.OnUpdated, {
				category: model,
			})

			return model.toObject({
				flattenObjectIds: true,
			})
		} catch (error) {
			if (
				MongoDBErrorHandler.isDuplicatedKeyError(error, 'category_name')
			) {
				throw new CategoryExistsException(category.category_name)
			}
			throw error
		}
	}

	async delete(categoryOrId: Category | string): Promise<boolean> {
		let category
		if (typeof categoryOrId === 'string') {
			category = await CategoryModel.findById(categoryOrId)
				.where({
					isMarkedDelete: false,
				})
				.populate('child_category_count')
				.exec()

			if (!category) {
				throw new CategoryNotFoundException(categoryOrId)
			}
		} else {
			category = categoryOrId
		}

		const model = new CategoryModel(category)
		model.isNew = false

		model.category_name = `${category.category_name}_${Date.now()}`
		model.isMarkedDelete = true

		await model.save()

		this.eventEmitter.emitAsync(CATEGORY_EVENTS.OnDeleted, {
			category: model,
		})

		return true
	}

	async find(options: {
		category_name: string
		is_parent: boolean
		page: number
		page_size: number
	}): Promise<{
		items: Category[]
		page_size: number
		page: number
		total_page: number
		total_count: number
	}> {
		const { page = 1, page_size = 10, category_name, is_parent } = options
		const filter = {
			isMarkedDelete: false,
			...(category_name && {
				$text: { $search: category_name },
			}),
		}
		if (!isNullOrUndefined(is_parent)) {
			let parentFilter
			if (is_parent) {
				parentFilter = {
					parent_id: {
						$eq: null,
					},
				}
			} else {
				parentFilter = {
					parent_id: {
						$ne: null,
					},
				}
			}
			filter['parent_id'] = parentFilter.parent_id
		}
		const [categoryList, count] = await Promise.all([
			CategoryModel.find(filter)
				.populate({
					path: 'parent_category',
					select: '_id category_name category_description',
				})
				.sort({
					createdAt: -1,
				})
				.skip((page - 1) * page_size)
				.limit(page_size)
				.exec(),
			CategoryModel.countDocuments(filter),
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

	async searchCategoriesByKeyword(keyword: string) {
		const escapedKeyword = Utils.escapeRegExp(keyword)
		const regexSearch: RegExp = new RegExp(escapedKeyword, 'i') // 'i' for case-insensitive search

		try {
			const query: Record<string, any> = {
				$text: { $search: regexSearch.source },
			}

			const results = await CategoryModel.find(query)
				.populate({
					path: 'parent_category',
					select: '_id category_name category_description',
				})
				.sort({ score: { $meta: 'textScore' } }) // Sort by text search score
				.lean()
				.exec()

			return results
		} catch (error) {
			console.error('Error while searching by keyword:', error)
			throw error
		}
	}
}
