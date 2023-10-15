import { BaseException } from '@libs'

export class CategoryExistsException extends BaseException {
	public code = 'CATEGORY_EXISTS_EXCEPTION'

	constructor(categoryName: string) {
		super(`Category with name ${categoryName} already exists`)
	}
}

export class CategoryNotFoundException extends BaseException {
	public code = 'CATEGORY_NOT_FOUND_EXCEPTION'

	constructor(categoryId: string) {
		super(`Category with id ${categoryId} not found`)
	}
}
