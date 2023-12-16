import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CategoryRepository } from '../database'
import {
	GetCategoryTreeQueryDTO,
	GetCategoryTreeResponseDTO,
} from './dtos/get-category-tree.dtos'
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
	async getCategoryTree(
		@Query() q: GetCategoryTreeQueryDTO,
	): Promise<GetCategoryTreeResponseDTO> {
		const { view } = q
		const select =
			view === 'full' ? 'all' : ['_id', 'category_name', 'parent_id']
		const categoryList: any[] =
			await this.categoryRepository.findAll(select)
		const categoryTree = []
		const childrenCategoryList = []
		// separate root categories and children categories
		categoryList.forEach((category) => {
			category.child_category_list = []
			if (category.parent_id) {
				childrenCategoryList.push(category)
			} else {
				category.level = 1 // root category has level = 1
				categoryTree.push(category)
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
				category.level = parentCategory.level + 1
				parentCategory.child_category_list.push(category)
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
