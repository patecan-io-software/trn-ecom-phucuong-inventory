import { Injectable, Logger } from '@nestjs/common'
import mongoose from 'mongoose'
import { Brand, BrandModel } from './models/brand.model'
import { BrandExistsException, BrandNotFoundException } from '../errors/brand.errors'
import { Utils } from '@libs'
import { ProductModel } from '@modules/client/product/database'

@Injectable()
export class BrandRepository {
	private logger: Logger = new Logger(BrandRepository.name)
	constructor() {}

	async getById(id: string): Promise<Brand> {
		const brand = await BrandModel.findById(id)
			.where({
				isMarkedDelete: false,
			})
			.select('-__v -isMarkedDelete -brand_products')
		if (!brand) {
			throw new BrandNotFoundException(id)
		}
		return brand.toObject({
			flattenObjectIds: true,
		})
	}

	async find(options: { page: number; page_size: number }): Promise<{
		items: Brand[]
		page_size: number
		page: number
		total_page: number
		total_count: number
	}> {
		const { page = 1, page_size = 10 } = options
		const [categoryList, count] = await Promise.all([
			BrandModel.find({ isMarkedDelete: false })
				.select('-__v -isMarkedDelete -brand_products')
				.skip((page - 1) * page_size)
				.limit(page_size)
				.exec(),
			BrandModel.countDocuments({ isMarkedDelete: false }),
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

	async searchBrandsByKeyword(keyword: string) {
		const escapedKeyword = Utils.escapeRegExp(keyword)
		const regexSearch: RegExp = new RegExp(escapedKeyword, 'i') // 'i' for case-insensitive search

		try {
			const query: Record<string, any> = {
				$text: { $search: regexSearch.source },
			}

			const results = await BrandModel.find(query)
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
