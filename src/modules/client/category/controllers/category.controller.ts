import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { CategoryDTO, ObjectIdParam } from './dtos/common.dto'

import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
	FindCategoriesQueryDTO,
	FindCategoriesResponseDTO,
} from './dtos/find-categories.dtos'
import { CategoryRepository } from '../database'
import { CategoryNotFoundException } from '../errors/category.errors'

@Controller('v1/categories')
@ApiTags('Client - Category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	@Get()
	@ApiResponse({
		status: 200,
		type: FindCategoriesResponseDTO,
	})
	async findCategories(
		@Query() query: FindCategoriesQueryDTO,
	): Promise<FindCategoriesResponseDTO> {
		const result = await this.categoryRepository.find(query)
		return new FindCategoriesResponseDTO(result)
	}

	@Get('/:id')
	@ApiResponse({
		status: 200,
		type: CategoryDTO,
	})
	async getById(@Param() { id }: ObjectIdParam): Promise<CategoryDTO> {
		const category = await this.categoryRepository.getById(id)
		if (!category) {
			throw new CategoryNotFoundException(id)
		}
		return new CategoryDTO(category)
	}
}
