import { BaseException } from '@libs'

export class SkuAlreadyExistsException extends BaseException {
	public code = 'SKU_ALREADY_EXISTS'

	constructor(skuList: string[]) {
		super('Following SKUs already exist: ' + skuList.join(','))
	}
}
