import { BaseException } from '@libs'

export class SkuAlreadyExistsException extends BaseException {
	public code = 'SKU_ALREADY_EXISTS'

	constructor(skuList: string[]) {
		super('Following SKUs already exist: ' + skuList.join(','))
	}
}

export class InventoryNotFoundException extends BaseException {
	public code = 'INVENTORY_NOT_FOUND'

	constructor(sku: string) {
		super(`Inventory with SKU '${sku}' not found`)
	}
}
