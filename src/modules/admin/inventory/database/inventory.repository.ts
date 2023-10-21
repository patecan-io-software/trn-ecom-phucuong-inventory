import { Inject, Injectable, Optional } from '@nestjs/common'
import { InventoryModel } from './models/inventory.model'
import { Inventory } from '../domain'
import { BaseRepository, DATABASE_CONNECTION } from '@infras/mongoose'
import { Connection } from 'mongoose'

@Injectable()
export class InventoryRepository extends BaseRepository {

	constructor(
		@Inject(DATABASE_CONNECTION)
		connection: Connection,
		@Optional()
		sessionId?: string
	) {
		super(connection, sessionId)
	}
	protected clone(sessionId: string) {
		return new InventoryRepository(this.connection, sessionId)
	}

	getBatchInventories(skuList: string[]) {
		return InventoryModel.find()
			.where({
				inventory_sku: { $in: skuList },
			})
			.exec()
	}

	async saveBatch(inventoryList: Inventory[]) {
		const rawList = inventoryList.map(
			(inventory) => {
				const raw = new InventoryModel(inventory)
				if (inventory._id) {
					raw.isNew = false	
				} else {
					raw.isNew = true
				}
				return raw
			},
		)
		await InventoryModel.bulkSave(rawList, {
			session: this.session,
		})
	}
}
