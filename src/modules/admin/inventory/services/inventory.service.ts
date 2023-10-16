import { Injectable } from '@nestjs/common'
import { CategoryRepository, InventoryRepository } from '../database'
import { Category } from '../domain'
import { CategoryNotFoundException } from '../errors/category.errors'
import { UpdateCategoryDTO } from './dtos/update-category.dto'
import { CreateCategoryDTO } from './dtos/create-category.dto'

@Injectable()
export class InventoryService {
	constructor(
		private readonly inventoryRepo: InventoryRepository,
		private readonly categoryRepo: CategoryRepository,
	) {}

	async createCategory(dto: CreateCategoryDTO) {
		const category: Category = {
			...dto,
			_id: undefined,
			category_isActive: true,
		}
		const result = await this.categoryRepo.create(category)
		return result
	}

	async getCategoryById(categoryId: string): Promise<Category> {
		const category = await this.categoryRepo.getById(categoryId)
		if (!category) {
			throw new CategoryNotFoundException(categoryId)
		}
		return category
	}

	async updateCategory(dto: UpdateCategoryDTO): Promise<Category> {
		const category = await this.categoryRepo.getById(dto._id)
		if (!category) {
			throw new CategoryNotFoundException(dto._id)
		}
		category.category_name = dto.category_name
		category.category_description = dto.category_description
		category.category_logoUrl = dto.category_logoUrl
		category.category_images = dto.category_images

		const result = await this.categoryRepo.update(category)

		return result
	}

	async deleteCategory(categoryId: string) {
		const success = await this.categoryRepo.deleteById(categoryId)
		if (!success) {
			throw new CategoryNotFoundException(categoryId)
		}
	}
}
