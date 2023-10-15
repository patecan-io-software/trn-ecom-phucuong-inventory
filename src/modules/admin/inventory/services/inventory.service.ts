import { Injectable } from '@nestjs/common'
import { CategoryRepository, InventoryRepository } from '../database'
import { Category } from '../domain'

@Injectable()
export class InventoryService {
	constructor(
		private readonly inventoryRepo: InventoryRepository,
		private readonly categoryRepo: CategoryRepository,
	) {}

	async createCategory(category: Category) {
		const result = await this.categoryRepo.create(category)
		return result
	}
}
