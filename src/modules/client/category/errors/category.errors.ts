import { BaseException } from '@libs'

export class CategoryNotFoundException extends BaseException {
	public code = 'CATEGORY_NOT_FOUND'

	constructor(categoryId: string) {
		super(`Category with id '${categoryId}' not found`)
	}
}
