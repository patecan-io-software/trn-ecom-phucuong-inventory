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

	constructor(categoryId: string) {
		super(
			`Parent categor with ID ${categoryId} not found or not a parent category`,
		)
	}
}

export class UpdateCategoryFailedException extends BaseException {
	public code = 'UPDATE_CATEGORY_FAILED'

	constructor(message: string) {
		super(message || 'Update category failed')
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
