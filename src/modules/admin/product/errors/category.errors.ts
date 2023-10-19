import { BaseException } from '@libs'

export class CategoryExistsException extends BaseException {
	public code = 'CATEGORY_EXISTS'

	constructor(categoryName: string) {
		super(`Category with name ${categoryName} already exists`)
	}
}

export class CategoryNotFoundException extends BaseException {
	public code = 'CATEGORY_NOT_FOUND'

	constructor(categoryId: string | string[]) {
		const list = categoryId instanceof Array ? categoryId : [categoryId]
		super(`Category with ids ${list.join(', ')} not found`)
	}
}
