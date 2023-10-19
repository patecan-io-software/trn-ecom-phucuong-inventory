import { Injectable } from '@nestjs/common'
import { InventoryModel } from './models/inventory.model'
import { Inventory } from '../domain'

@Injectable()
export class InventoryRepository {
	getBatchInventories(skuList: string[]) {
		return InventoryModel.find()
			.where({
				sku: { $in: skuList },
			})
			.exec()
	}

	async saveBatch(inventoryList: Inventory[]) {
		const rawList = inventoryList.map(
			(inventory) => new InventoryModel(inventory),
		)
		await InventoryModel.insertMany(rawList)
	}
}
