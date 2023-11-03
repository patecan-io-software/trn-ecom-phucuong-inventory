import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Inject,
	Logger,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ProductService } from '../services/product.service'
import {
	CreateCategoryRequestDTO,
	CreateCategoryResponseDTO,
} from './dtos/category/create-category.dtos'
import {
	ApiExtraModels,
	ApiOkResponse,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import {
	UpdateCategoryRequestDTO,
	UpdateCategoryResponseDTO,
} from './dtos/category/update-category.dtos'
import { SuccessResponseDTO } from '@libs'
import {
	FindCategoriesQueryDTO,
	FindCategoriesResponseDTO,
} from './dtos/category/find-categories.dtos'
import { Category, CategoryRepository } from '../database'
import { AdminAuth } from '@modules/admin/auth'
import { ObjectIdParam } from './dtos/common.dto'
import { CategoryDTO } from './dtos/category/category.dtos'
import { ProductModuleConfig } from '../interfaces'
import { PRODUCT_MODULE_CONFIG } from '../constants'
import { ImageUploader } from '@modules/admin/image-uploader'
import {
	CategoryNotFoundException,
	ParentCategoryCannotBeChangedException,
	UpdateCategoryFailedException,
} from '../errors/category.errors'

@Controller('v1/admin/categories')
@ApiTags('Admin - Category')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('apiKey')
export class CategoryController {
	private readonly logger: Logger = new Logger(CategoryController.name)

	constructor(
		@Inject(PRODUCT_MODULE_CONFIG)
		private readonly config: ProductModuleConfig,
		private readonly imageUploader: ImageUploader,
		private readonly inventoryService: ProductService,
		private readonly categoryRepo: CategoryRepository,
	) {}

	@Post()
	@ApiResponse({
		status: 201,
		type: CreateCategoryResponseDTO,
	})
	async create(
		@Body() dto: CreateCategoryRequestDTO,
	): Promise<CreateCategoryResponseDTO> {
		const categoryId = this.categoryRepo.genId()
		if (dto.parent_id) {
			const parentCategory = await this.categoryRepo.getById(
				dto.parent_id,
			)
			if (!parentCategory || !parentCategory.is_parent) {
				throw new UpdateCategoryFailedException(dto.parent_id)
			}
		}

		await this.updateCategoryImage(categoryId, dto)

		const category: Category = {
			...dto,
			_id: categoryId,
			category_isActive: true,
		}
		try {
			const result = await this.categoryRepo.create(category)
			return new CreateCategoryResponseDTO({ data: result })
		} catch (error) {
			this.logger.error(error)
			await this.removeCategoryImage(category._id)
			throw error
		}
	}

	@Get()
	@ApiResponse({
		status: 200,
		type: FindCategoriesResponseDTO,
	})
	async findCategories(
		@Query() query: FindCategoriesQueryDTO,
	): Promise<FindCategoriesResponseDTO> {
		const result = await this.categoryRepo.find(query)
		return new FindCategoriesResponseDTO(result)
	}

	@Get('/:id')
	@ApiResponse({
		status: 200,
		type: CategoryDTO,
	})
	async getById(@Param() { id }: ObjectIdParam): Promise<CategoryDTO> {
		const category = await this.categoryRepo.getById(id)
		return new CategoryDTO(category)
	}

	@Put('/:id')
	async updateCategory(
		@Param() { id }: ObjectIdParam,
		@Body() body: UpdateCategoryRequestDTO,
	) {
		const category = await this.categoryRepo.getById(id)
		if (!category) {
			throw new CategoryNotFoundException(id)
		}

		// update category from parent to child
		if (category.is_parent && body.parent_id) {
			if (category.child_category_count > 0) {
				throw new UpdateCategoryFailedException(
					'Parent category cannot be changed to child category',
				)
			}
			const parentCategory = await this.categoryRepo.getById(
				body.parent_id,
			)
			if (!parentCategory || !parentCategory.is_parent) {
				throw new UpdateCategoryFailedException(
					'Invalid parent category. Parent category is neither not found nor a parent category',
				)
			}
		}

		await this.updateCategoryImage(category._id, body)

		category.parent_id = body.parent_id
		category.category_name = body.category_name
		category.category_description = body.category_description
		category.category_logoUrl = body.category_logoUrl
		category.category_images = body.category_images

		const result = await this.categoryRepo.update(category)

		return new UpdateCategoryResponseDTO({ data: result })
	}

	@Delete('/:id')
	@ApiOkResponse({
		status: 200,
		type: SuccessResponseDTO,
	})
	async deleteCategory(@Param() { id }: ObjectIdParam): Promise<void> {
		const category = await this.categoryRepo.getById(id)
		if (!category) {
			throw new CategoryNotFoundException(id)
		}
		if (category.is_parent && category.child_category_count > 0) {
			throw new ParentCategoryCannotBeChangedException(
				category.child_category_count,
			)
		}
		await this.categoryRepo.delete(category)
		return
	}

	@Get('/search/:keyword')
	@ApiResponse({
		status: 201,
		type: CategoryDTO,
	})
	async searchCategoriesByKeyword(
		@Param('keyword') keyword: string,
	): Promise<FindCategoriesResponseDTO> {
		const brands =
			await this.categoryRepo.searchCategoriesByKeyword(keyword)
		return new FindCategoriesResponseDTO(brands)
	}

	private async updateCategoryImage(
		categoryId: string,
		dto: CreateCategoryRequestDTO | UpdateCategoryRequestDTO,
	) {
		const results = await Promise.allSettled(
			dto.category_images.map(async (image) => {
				const newImageUrl = await this.imageUploader.copyFromTempTo(
					image.imageUrl,
					`${this.config.basePaths.category}/${categoryId}/${image.imageName}`,
				)
				image.imageUrl = newImageUrl
			}),
		)

		const failedResults = results.filter(
			(result) => result.status === 'rejected',
		)

		this.logger.warn(JSON.stringify(failedResults))

		dto.category_logoUrl = dto.category_images[0].imageUrl
	}

	private async removeCategoryImage(categoryId: string) {
		await this.imageUploader.removeImagesByFolder(
			`${this.config.basePaths.category}/${categoryId}`,
		)
	}
}
