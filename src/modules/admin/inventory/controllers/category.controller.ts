import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { InventoryService } from '../services/inventory.service'
import { CategoryDTO, ObjectIdParam } from './dtos/common.dto'
import {
	CreateCategoryRequestDTO,
	CreateCategoryResponseDTO,
} from './dtos/create-category.dtos'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
	UpdateCategoryRequestDTO,
	UpdateCategoryResponseDTO,
} from './dtos/update-category.dtos'
import { SuccessResponseDTO } from '@libs'
import {
	FindCategoriesQueryDTO,
	FindCategoriesResponseDTO,
} from './dtos/find-categories.dtos'
import { CategoryRepository } from '../database'

@Controller('v1/categories')
@ApiTags('Admin - Category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
	constructor(
		private readonly inventoryService: InventoryService,
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
		const category = await this.inventoryService.createCategory(dto)
		return new CreateCategoryResponseDTO({ data: category })
	}

	@Get()
	@ApiResponse({
		status: 201,
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
		status: 201,
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
		const category = await this.inventoryService.updateCategory({
			_id: id,
			...body,
		})
		return new UpdateCategoryResponseDTO({ data: category })
	}

	@Delete('/:id')
	@ApiOkResponse({
		status: 200,
		type: SuccessResponseDTO,
	})
	async deleteCategory(@Param() { id }: ObjectIdParam): Promise<void> {
		await this.inventoryService.deleteCategory(id)
		return
	}
}
