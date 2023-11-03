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

export class InvalidParentCategoryException extends BaseException {
	public code = 'INVALID_PARENT_CATEGORY'

	constructor() {
		super(
			'Invalid parent category. Parent category is neither not found nor a parent category',
		)
	}
}

export class ParentCategoryCannotBeChangedException extends BaseException {
	public code = 'PARENT_CATEGORY_CANNOT_BE_CHANGED'

	constructor(child_category_count: number) {
		super(
			`Parent category cannot be changed. Child category count: ${child_category_count}`,
		)
	}
}
