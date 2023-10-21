import { BaseException } from '@libs'

export class ProductMaterialExistsException extends BaseException {
	public code = 'PRODUCT_MATERIAL_EXISTS'

	constructor(name: string) {
		super(`Product material with name ${name} already exists`)
	}
}
