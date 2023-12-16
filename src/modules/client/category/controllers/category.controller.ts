import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
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
import { GetCategoryTreeResponseDTO } from './dtos/get-category-tree.dtos'
import { CacheInterceptor } from '@nestjs/cache-manager'

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

	@Get('/:getCategoryTree')
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		type: GetCategoryTreeResponseDTO,
	})
	@UseInterceptors(CacheInterceptor)
	async getCategoryTree(): Promise<GetCategoryTreeResponseDTO> {
		const categoryList = await this.categoryRepository.findAll()
		const categoryTree = []
		const childrenCategoryList = []
		// separate root categories and children categories
		categoryList.forEach((category) => {
			if (category.parent_id) {
				childrenCategoryList.push(category)
			} else {
				categoryTree.push({
					...category,
					level: 1,
				})
			}
		})

		// looop through child categories
		while (childrenCategoryList.length > 0) {
			// remove first category in the list
			const category = childrenCategoryList.shift()
			// find its parent
			const parentCategory = findCategoryInTree(
				categoryTree,
				category.parent_id,
			)
			if (parentCategory) {
				if (!parentCategory.child_category_list) {
					parentCategory.child_category_list = []
				}
				parentCategory.child_category_list.push({
					...category,
					level: parentCategory.level + 1,
				})
			} else {
				// if parent not found, it means that parent is still in childrenCategoryList, so add it back to the list and try again later
				childrenCategoryList.push(category)
			}
		}

		return new GetCategoryTreeResponseDTO({
			items: categoryTree,
		})

		function findCategoryInTree(categoryTree: any[], categoryId: string) {
			const category = categoryTree.find((cat) => cat._id === categoryId)
			if (category) {
				return category
			}
			for (let i = 0; i < categoryTree.length; i++) {
				const cat = categoryTree[i]
				if (cat.child_category_list) {
					const foundCategory = findCategoryInTree(
						cat.child_category_list,
						categoryId,
					)
					if (foundCategory) {
						return foundCategory
					}
				}
			}
		}
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
