import { BaseException } from '@libs'

export class BrandExistsException extends BaseException {
	public code = 'BRAND_EXISTS'

	constructor(brandName: string) {
		super(`Brand with name '${brandName}' already exists`)
	}
}

export class BrandNotFoundException extends BaseException {
	public code = 'BRAND_NOT_FOUND'

	constructor(brandId: string) {
		super(`Brand with id '${brandId}' not found`)
	}
}
