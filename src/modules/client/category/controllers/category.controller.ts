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
import { BrandDTO } from '@modules/client/brand/controllers/dtos/brand/brand.dtos'
import {
	FindProductsQueryDTO,
	FindProductsResponseDTO,
} from '../../product/controllers/dtos/find-products-query.dtos'
import { ProductRepository } from '@modules/client/product/database'
import { CategoryService } from '../services'

@Controller('v1/categories')
@ApiTags('Client - Category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
	constructor(
		private readonly categoryService: CategoryService,
		private readonly categoryRepository: CategoryRepository,
		private readonly productRepository: ProductRepository,
	) {}

	@Get('/search/:keyword')
	@ApiResponse({
		status: 201,
		type: CategoryDTO,
	})
	async searchCategoriesByKeyword(
		@Param('keyword') keyword: string,
	): Promise<FindCategoriesResponseDTO> {
		const brands =
			await this.categoryRepository.searchCategoriesByKeyword(keyword)
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

	@Get('/:id/products')
	@ApiResponse({
		status: 201,
		type: FindProductsResponseDTO,
	})
	async findProductsByCategoryId(
		@Param('id') categoryId: string,
		@Query()
		query: {
			page: number
			page_size: number
			filters: Record<string, any>
		},
	): Promise<FindProductsResponseDTO> {
		const result = await this.productRepository.findByCategoryId(
			categoryId,
			query,
		)
		return new FindProductsResponseDTO(result)
	}
}
