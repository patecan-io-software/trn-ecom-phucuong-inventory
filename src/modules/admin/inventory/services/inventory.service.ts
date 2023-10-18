import { Injectable } from '@nestjs/common'
import { CategoryRepository, InventoryRepository } from '../database'
import {
	Category,
	CreateProductDTO,
	Product,
	UpdateProductDTO,
} from '../domain'
import { CategoryNotFoundException } from '../errors/category.errors'
import { UpdateCategoryDTO } from './dtos/update-category.dto'
import { CreateCategoryDTO } from './dtos/create-category.dto'
import {
	ProductNotFoundException,
	SkuAlreadyExistsException,
} from '../errors/product.errors'
import { PRODUCT_MODEL } from '../constants'

@Injectable()
export class InventoryService {
	constructor(
		private readonly inventoryRepo: InventoryRepository,
		private readonly categoryRepo: CategoryRepository,
	) {}

	async createProduct(dto: CreateProductDTO) {
		const product = Product.createProduct(dto)

		const newProduct = await this.inventoryRepo.save(product)
		return newProduct
	}

	async updateProduct(productId: string, dto: UpdateProductDTO) {
		const product = await this.inventoryRepo.getProductById(productId)
		if (!product) {
			throw new ProductNotFoundException(productId)
		}
		product.update(dto)
		const updatedProduct = await this.inventoryRepo.save(product)
		return updatedProduct
	}

	async deleteProduct(productId: string) {
		const result = await this.inventoryRepo.deleteProductById(productId)
		return result
	}

	async searchProductsByKeyword(keyword: string) {
		const result = await this.inventoryRepo.searchProductsByKeyword(keyword)
		return result
	}

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
