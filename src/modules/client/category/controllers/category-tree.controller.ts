import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
	UseInterceptors,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CategoryRepository } from '../database'
import { GetCategoryTreeResponseDTO } from './dtos/get-category-tree.dtos'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Controller('v1/categories::categoryTree')
@ApiTags('Client - Category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryTreeController {
	constructor(private readonly categoryRepository: CategoryRepository) {}

	@Get()
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
}
