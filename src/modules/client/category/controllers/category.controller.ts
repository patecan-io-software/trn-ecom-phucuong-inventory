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
import { CategoryDTO, ObjectIdParam } from './dtos/common.dto'

import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SuccessResponseDTO } from '@libs'
import {
	FindCategoriesQueryDTO,
	FindCategoriesResponseDTO,
} from './dtos/find-categories.dtos'
import { CategoryRepository } from '../database'
import { InventoryService } from '@modules/admin/inventory/services'
import { CategoryService } from '@modules/client/category/services'
import { BrandDTO } from '@modules/client/brand/controllers/dtos/brand/brand.dtos'
import { SearchBrandsResponseDTO } from '@modules/client/brand/controllers/dtos/brand/find-brands.dtos'

@Controller('v1/categories')
@ApiTags('Client - Category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
	constructor(private readonly categoryService: CategoryService, private readonly categoryRepository: CategoryRepository) {}

	@Get('/search/:keyword')
	@ApiResponse({
		status: 201,
		type: CategoryDTO,
	})
	async searchCategoriesByKeyword(@Param('keyword') keyword: string): Promise<FindCategoriesResponseDTO> {
		const brands = await this.categoryRepository.searchCategoriesByKeyword(keyword)
		return new FindCategoriesResponseDTO(brands)
	}

	@Get()
	@ApiResponse({
		status: 201,
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
		status: 201,
		type: CategoryDTO,
	})
	async getById(@Param() { id }: ObjectIdParam): Promise<CategoryDTO> {
		const category = await this.categoryService.getById(id)
		return new CategoryDTO(category)
	}


}
