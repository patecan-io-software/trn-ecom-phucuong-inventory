import { Injectable } from '@nestjs/common'
import { CategoryRepository} from '../database'
import { Category} from '../domain'
import { CategoryNotFoundException } from '../errors/category.errors'

@Injectable()
export class CategoryService {
	constructor(
		private readonly categoryRepo: CategoryRepository,
	) {}


	async getById(categoryId: string): Promise<Category> {
		const category = await this.categoryRepo.getById(categoryId)
		if (!category) {
			throw new CategoryNotFoundException(categoryId)
		}
		return category
	}






}
