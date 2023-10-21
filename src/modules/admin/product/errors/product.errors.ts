import { BaseException } from '@libs'

export class DuplicateProductNameException extends BaseException {
	public code = 'DUPLICATE_PRODUCT_NAME'
	constructor(product_name: string) {
		super(`Product name is duplicated: ${product_name}`)
	}
}

export class DuplicateProductVariantException extends BaseException {
	public code = 'DUPLICATE_PRODUCT_VARIANT'
	constructor(product_variant: string) {
		super(`Product variant is duplicated: ${product_variant}`)
	}
}

export class InvalidProductVariantException extends BaseException {
	public code = 'INVAID_PRODUCT_VARIANT'
	constructor(product_variant: string) {
		super(`Invalid product variant: ${product_variant}`)
	}
}

export class CreateProductFailedException extends BaseException {
	public code = 'CREATE_PRODUCT_FAILED'
	constructor() {
		super('Create product failed')
	}
}

export class DuplicateImageNameException extends BaseException {
	public code = 'DUPLICATE_IMAGE_NAME'
	constructor(image_name: string) {
		super(`Image name is duplicated: ${image_name}`)
	}
}


export class ProductNotFoundException extends BaseException {
	public code = 'PRODUCT_NOT_FOUND'
	constructor(productId: string) {
		super(`Product with id ${productId} not found`)
	}
}
