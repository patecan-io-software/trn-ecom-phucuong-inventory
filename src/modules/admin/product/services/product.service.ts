import { v4 as uuidv4 } from 'uuid'
import { Inject, Injectable, Logger } from '@nestjs/common'
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
import { PRODUCT_MODULE_CONFIG } from '../constants'
import { ProductModuleConfig } from '../interfaces'
import { ImageUploader } from '@modules/admin/image-uploader'

@Injectable()
export class ProductService {
	private readonly logger = new Logger(ProductService.name)
	constructor(
		@Inject(PRODUCT_MODULE_CONFIG)
		private readonly config: ProductModuleConfig,
		private readonly imageUploader: ImageUploader,
		private readonly productRepo: ProductRepository,
		private readonly categoryRepo: CategoryRepository,
		private readonly inventoryService: InventoryService,
	) {}

	async createProduct(dto: CreateProductDTO) {
		dto._id = this.productRepo.genId()
		const product = Product.createProduct(dto)

		await this.updateProductImage(dto._id, dto)

		const productRepo =
			await this.productRepo.startTransaction<ProductRepository>()
		try {
			const newProduct = await productRepo.save(product)

			await this.inventoryService.createInventories(
				product,
				productRepo.sessionId,
			)

			await productRepo.commitTransaction()

			return newProduct
		} catch (error) {
			this.logger.error(error)
			await productRepo.abortTransaction()
			this.removeProductImage(dto._id)
			throw error
		}
	}

	async updateProduct(productId: string, dto: UpdateProductDTO) {
		const product = await this.productRepo.getProductById(productId)
		if (!product) {
			throw new ProductNotFoundException(productId)
		}

		await this.removeProductImage(productId)
		await this.updateProductImage(productId, dto)

		product.update(dto)

		const productRepo =
			await this.productRepo.startTransaction<ProductRepository>()

		try {
			const updatedProduct = await productRepo.save(product, false)

			await this.inventoryService.updateInventoriesOfProduct(
				product,
				productRepo.sessionId,
			)

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
			_id: this.categoryRepo.genId(),
			category_isActive: true,
		}
		//await this.updateCategoryImage(category, false)
		try {
			const result = await this.categoryRepo.create(category)
			return result
		} catch (error) {
			this.logger.error(error)
			//await this.removeCategoryImage(category._id)
			throw error
		}
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

		await this.updateCategoryImage(category, true)

		const result = await this.categoryRepo.update(category)

		return result
	}

	async deleteCategory(categoryId: string) {
		const success = await this.categoryRepo.deleteById(categoryId)
		if (!success) {
			throw new CategoryNotFoundException(categoryId)
		}
	}

	private async updateCategoryImage(category: Category, remove = false) {
		if (remove) {
			await this.removeCategoryImage(category._id)
		}
		const categoryImageList: { imageName: string; imageUrl: string }[] = [
			{
				imageName: category.category_logoUrl.split('/').pop(), // brand/1/image_01.png -> image_01.png
				imageUrl: category.category_logoUrl,
			},
			...category.category_images,
		]
		const categoryId = category._id
		const [logo, ...imageList] = await Promise.all(
			categoryImageList.map(async (image) => {
				const newImageUrl = await this.imageUploader.copyFromTempTo(
					image.imageUrl,
					`${this.config.basePaths.category}/${categoryId}/${image.imageName}`,
				)
				image.imageUrl = newImageUrl
				return image
			}),
		)
		category.category_logoUrl = logo.imageUrl
		category.category_images = imageList
	}

	private async updateProductImage(
		productId: string,
		product: CreateProductDTO | UpdateProductDTO,
	) {
		const productImages = product.product_variants
			.flatMap((variant) => variant.image_list)
			.concat(product.product_banner_image)
			.reduce((pre, cur) => {
				return {
					...pre,
					[cur.imageName]: {
						imageName: cur.imageName,
						imageUrl: cur.imageUrl,
					},
				}
			}, {})

		await Promise.all(
			Object.keys(productImages).map(async (imageName) => {
				const newImageUrl = await this.imageUploader.copyFromTempTo(
					productImages[imageName].imageUrl,
					`${this.config.basePaths.product}/${productId}/${imageName}`,
				)
				productImages[imageName].imageUrl = newImageUrl
			}),
		)
		product.product_banner_image =
			productImages[product.product_banner_image.imageName]
		product.product_variants.forEach((variant) => {
			variant.image_list.forEach((image) => {
				image.imageUrl = productImages[image.imageName].imageUrl
			})
		})
	}

	private async removeCategoryImage(categoryId: string) {
		await this.imageUploader.removeImagesByFolder(
			`${this.config.basePaths.category}/${categoryId}`,
		)
	}

	private async removeProductImage(productId: string) {
		await this.imageUploader.removeImagesByFolder(
			`${this.config.basePaths.product}/${productId}`,
		)
	}
}
