import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../database'
import { Category } from '../domain'
import { CategoryNotFoundException } from '../errors/category.errors'
import { ProductNotFoundException } from '@modules/admin/inventory/errors/product.errors'
import { Product } from '@modules/client/product/domain'
import { ProductRepository } from '@modules/client/product/database'

@Injectable()
export class CategoryService {
	constructor(
		private readonly categoryRepo: CategoryRepository,
		private readonly productRepo: ProductRepository,
	) {}

	async getById(categoryId: string): Promise<Category> {
		const category = await this.categoryRepo.getById(categoryId)
		if (!category) {
			throw new CategoryNotFoundException(categoryId)
		}
		return category
	}
}
