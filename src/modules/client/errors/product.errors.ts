import { BaseException } from '@libs'

export class DuplicateProductVariantException extends BaseException {
	public code = 'DUPLICATE_PRODUCT_VARIANT'
	constructor(product_variant: string) {
		super(`Product variant is duplicated: ${product_variant}`)
	}
}

export class CreateProductFailedException extends BaseException {
	public code = 'CREATE_PRODUCT_FAILED'
	constructor() {
		super('Create product failed')
	}
}
