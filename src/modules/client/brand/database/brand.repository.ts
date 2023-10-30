import { Injectable } from '@nestjs/common'
import { Brand, BrandModel } from './models/brand.model'
import { IPaginationResult, Utils } from '@libs'

@Injectable()
export class BrandRepository {
	constructor() {}

	async getById(id: string): Promise<Brand> {
		const brand = await BrandModel.findById(id)
			.where({
				isMarkedDelete: false,
			})
			.select(this.getSelectFields())
		if (!brand) {
			return null
		}
		return brand.toObject({
			flattenObjectIds: true,
		})
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

		const findBrandQuery = BrandModel.find(query)
			.select(this.getSelectFields())
			.sort({
				createdAt: -1,
			})
			.skip((page - 1) * page_size)
			.limit(page_size)

		q && findBrandQuery.where({ $text: { $search: q } })

		const [results, count] = await Promise.all([
			findBrandQuery.exec(),
			BrandModel.countDocuments(query),
		])

		return {
			items: results.map((cat) =>
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
		return '-__v -isMarkedDelete -brand_products -createdAt -updatedAt -brand_isActive'
	}
}
