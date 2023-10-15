import { Inject, Injectable, Logger } from '@nestjs/common'
import { Model } from 'mongoose'
import { CATEGORY_MODEL } from '../constants'
import { Category } from '../domain'
import { CategoryExistsException } from '../errors/category.errors'

@Injectable()
export class CategoryRepository {
	private logger: Logger = new Logger(CategoryRepository.name)
	constructor(
		@Inject(CATEGORY_MODEL)
		private readonly categoryModel: Model<Category>,
	) {}

	async create(category: Category) {
		try {
			const result = await this.categoryModel.create(category)
			return result
		} catch (error) {
			this.logger.error(error)
			throw new CategoryExistsException(category.category_name)
		}
	}
}
