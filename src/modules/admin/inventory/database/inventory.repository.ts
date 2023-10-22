import { Inject, Injectable, Optional } from '@nestjs/common'
import { InventoryModel } from './models/inventory.model'
import { Inventory } from '../domain'
import { BaseRepository, DATABASE_CONNECTION } from '@infras/mongoose'
import { Connection } from 'mongoose'
import { IPaginationResult } from '@libs'

@Injectable()
export class InventoryRepository extends BaseRepository {
	constructor(
		@Inject(DATABASE_CONNECTION)
		connection: Connection,
		@Optional()
		sessionId?: string,
	) {
		super(connection, sessionId)
	}
	protected clone(sessionId: string) {
		return new InventoryRepository(this.connection, sessionId)
	}

	async searchInventories(options: {
		page: number
		page_size: number
		inventory_sku: string
	}): Promise<IPaginationResult> {
		const { page = 1, page_size = 10, inventory_sku } = options
		const query = {
			isMarkedDelete: false,
			...(inventory_sku && { inventory_sku }),
		}
		const [results, totalCount] = await Promise.all([
			InventoryModel.find()
				.where(query)
				.limit(page_size)
				.skip((page - 1) * page_size)
				.select(this.getSelectFields())
				.sort({ createdAt: -1 })
				.exec(),
			InventoryModel.countDocuments(query).exec(),
		])

		return {
			items: results.map((raw) =>
				raw.toObject({ flattenObjectIds: true }),
			),
			page: page,
			page_size: page_size,
			total_page: Math.ceil(totalCount / page_size),
			total_count: totalCount,
		}
	}

	getBatchInventories(skuList: string[]) {
		return InventoryModel.find()
			.where({
				inventory_sku: { $in: skuList },
				isMarkedDelete: false,
			})
			.exec()
	}

	async saveBatch(inventoryList: Inventory[]) {
		const rawList = inventoryList.map((inventory) => {
			const raw = new InventoryModel(inventory)
			if (inventory._id) {
				raw.isNew = false
			} else {
				raw.isNew = true
			}
			return raw
		})
		await InventoryModel.bulkSave(rawList, {
			session: this.session,
		})
	}

	private getSelectFields() {
		return '-__v -isMarkedDelete -inventory_shopId -inventory_parents -inventory_isActive -inventory_reservations -inventory_location -isMarkedDelete'
	}
}
