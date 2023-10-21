import { v4 as uuidv4 } from 'uuid'
import { Injectable, Logger } from '@nestjs/common'
import { CategoryRepository, ProductRepository } from '../database'
import {
	Category,
	CreateProductDTO,
	Product,
	UpdateProductDTO,
} from '../domain'
import { CategoryNotFoundException } from '../errors/category.errors'
import { UpdateCategoryDTO } from './dtos/update-category.dto'
import { CreateCategoryDTO } from './dtos/create-category.dto'
import { ProductNotFoundException } from '../errors/product.errors'
import { InventoryService } from '@modules/admin/inventory'

@Injectable()
export class ProductService {
	private readonly logger = new Logger(ProductService.name)
	constructor(
		private readonly productRepo: ProductRepository,
		private readonly categoryRepo: CategoryRepository,
		private readonly inventoryService: InventoryService,
	) {}

	async createProduct(dto: CreateProductDTO) {
		const product = Product.createProduct(dto)
		const productRepo = await this.productRepo.startTransaction<ProductRepository>()

		try {
			const newProduct = await productRepo.save(product)
	
			await this.inventoryService.createInventories(product, productRepo.sessionId)
	
			await productRepo.commitTransaction()
			
			return newProduct
		} catch (error) {
			this.logger.error(error)
			await productRepo.abortTransaction()
			throw error
		}
	}

	async updateProduct(productId: string, dto: UpdateProductDTO) {
		const product = await this.productRepo.getProductById(productId)
		if (!product) {
			throw new ProductNotFoundException(productId)
		}

		const productRepo = await this.productRepo.startTransaction<ProductRepository>()

		try {
			product.update(dto)
			const updatedProduct = await productRepo.save(product)
	
			await this.inventoryService.updateInventoriesOfProduct(product, productRepo.sessionId)

			await productRepo.commitTransaction()

			return updatedProduct
		} catch (error) {
			this.logger.error(error)
			await productRepo.abortTransaction()
			throw error
		}
	}

	async deleteProduct(productId: string) {
		const result = await this.productRepo.deleteProductById(productId)
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
