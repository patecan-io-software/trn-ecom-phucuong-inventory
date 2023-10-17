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

export class DuplicateImageNameException extends BaseException {
	public code = 'DUPLICATE_IMAGE_NAME'
	constructor(image_name: string) {
		super(`Image name is duplicated: ${image_name}`)
	}
}

export class SkuAlreadyExistsException extends BaseException {
	public code = 'SKU_ALREADY_EXISTS'
	constructor(skuList: string[]) {
		super(`Following SKUs already exists: ${skuList.join(', ')}`)
	}
}

export class ProductNotFoundException extends BaseException {
	public code = 'PRODUCT_NOT_FOUND'
	constructor(productId: string) {
		super(`Product with id ${productId} not found`)
	}
}
