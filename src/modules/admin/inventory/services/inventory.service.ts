import { Injectable, Logger } from '@nestjs/common'
import { InventoryRepository } from '../database/inventory.repository'
import { Product, ProductVariant, SerializedProductVariant } from '@modules/admin/product'
import { SkuAlreadyExistsException } from '../errors/inventory.errors'
import { Inventory, InventoryFactory } from '../domain'

@Injectable()
export class InventoryService {
	private readonly logger = new Logger(InventoryService.name)
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

	async updateInventoriesOfProduct(product: Product, sessionId?: string) {
		const { product_variants } = product.serialize()
		const variantObj: { [key: string]: SerializedProductVariant } = product_variants.reduce((pre, cur) => {
			pre[cur.sku] = cur
			return pre
		}, {})
		const inventoryList = await this.inventoryRepo.getBatchInventories(Object.keys(variantObj))

		const updatedInventoryList = []
		
		inventoryList.forEach((inventory) => {
			const variant = variantObj[inventory.inventory_sku]
			let updated = false
			if (inventory.inventory_stock !== variant.quantity) {
				inventory.inventory_stock = variant.quantity
				updated = true
			}
			if (inventory.inventory_price !== variant.price) {
				inventory.inventory_price = variant.price
				updated = true
			}
			if (inventory.inventory_discount_price !== variant.discount_price) {
				inventory.inventory_discount_price = variant.discount_price
				updated = true
			}
			if (updated) {
				updatedInventoryList.push(inventory)
			}
		})

		if (updatedInventoryList.length === 0) {
			return
		}

		let inventoryRepo: InventoryRepository
		if (sessionId) {
			inventoryRepo = this.inventoryRepo.getRepositoryTransaction<InventoryRepository>(sessionId)
		} else {
			inventoryRepo = this.inventoryRepo
		}
		await inventoryRepo.saveBatch(updatedInventoryList)
	}
}
