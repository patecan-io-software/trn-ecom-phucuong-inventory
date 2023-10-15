import { BaseException } from '@libs'

export class CategoryExistsException extends BaseException {
	public code = 'CATEGORY_EXISTS_EXCEPTION'

	constructor(categoryName: string) {
		super(`Category with name ${categoryName} already exists`)
	}
}
