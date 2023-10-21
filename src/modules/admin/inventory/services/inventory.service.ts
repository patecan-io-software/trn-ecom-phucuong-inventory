import { Injectable } from '@nestjs/common'
import { InventoryRepository } from '../database/inventory.repository'
import { Product } from '@modules/admin/product'
import { SkuAlreadyExistsException } from '../errors/inventory.errors'
import { Inventory, InventoryFactory } from '../domain'

@Injectable()
export class InventoryService {
	constructor(
		private readonly inventoryRepo: InventoryRepository,
		private readonly inventoryFactory: InventoryFactory,
	) {}

	async createInventories(product: Product, sessionId?: string): Promise<Inventory[]> {
		const { product_variants } = product.serialize()
		const skuList = product_variants.map((variant) => variant.sku)
		const existingInventoryList =
			await this.inventoryRepo.getBatchInventories(skuList)

		if (existingInventoryList.length > 0) {
			const skuList = existingInventoryList.map(
				(inventory) => inventory.inventory_sku,
			)
			throw new SkuAlreadyExistsException(skuList)
		}

		const inventoryList =
			this.inventoryFactory.createInventoriesForProduct(product)

		let inventoryRepo: InventoryRepository
		if (sessionId) {
			inventoryRepo = this.inventoryRepo.getRepositoryTransaction<InventoryRepository>(sessionId)
		} else {
			inventoryRepo = this.inventoryRepo
		}

		await inventoryRepo.saveBatch(inventoryList)
		return inventoryList
	}
}
