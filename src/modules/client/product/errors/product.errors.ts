import { BaseException } from '@libs'

export class ProductNotFoundException extends BaseException {
	public code = 'PRODUCT_NOT_FOUND'
	constructor(productIdOrSlug: string, isId = true) {
		const label = isId ? 'id' : 'slug'
		super(`Product with ${label} '${productIdOrSlug}' is not found`)
	}
}
