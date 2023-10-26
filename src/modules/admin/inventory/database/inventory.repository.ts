import { Inject, Injectable, Optional } from '@nestjs/common'
import { InventoryModel } from './models/inventory.model'
import { Inventory } from '../domain'
import { BaseRepository, DATABASE_CONNECTION } from '@infras/mongoose'
import { Connection } from 'mongoose'
import { IPaginationResult } from '@libs'
import { ProductModel } from '@modules/client/product/database'

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
				.populate('inventory_productId', 'product_name')
				.exec(),
			InventoryModel.countDocuments(query).exec(),
		])

		return {
			items: results.map((raw) => {
				const result = raw.toObject({ flattenObjectIds: true })
				return {
					...result,
					product_name:
						(result.inventory_productId as any)?.product_name ?? '',
				}
			}),
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

	async getBySku(sku: string): Promise<Inventory> {
		const inventory = await InventoryModel.findOne()
			.where({
				inventory_sku: sku,
			})
			.exec()
		if (!inventory) {
			return null
		}
		return inventory.toObject({
			flattenObjectIds: true,
		})
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

	async save(inventory: Inventory): Promise<Inventory> {
		const raw = new InventoryModel(inventory)
		if (inventory._id) {
			raw.isNew = false
		} else {
			raw.isNew = true
		}
		const result = await raw.save()

		const updatedInventory = result.toObject()

		await this.propagateProductVariant(updatedInventory as any)

		return {
			_id: updatedInventory._id.toHexString() as any,
			inventory_discount_price: updatedInventory.inventory_discount_price,
			inventory_price: updatedInventory.inventory_price,
			inventory_stock: updatedInventory.inventory_stock,
			inventory_sku: updatedInventory.inventory_sku,
			inventory_productId: updatedInventory.inventory_productId,
			inventory_shopId: updatedInventory.inventory_shopId,
			inventory_location: updatedInventory.inventory_location,
			inventory_isActive: updatedInventory.inventory_isActive,
			inventory_reservations: updatedInventory.inventory_reservations,
			inventory_parents: updatedInventory.inventory_parents,
		} as any
	}

	private async propagateProductVariant(inventory: Inventory) {
		const product = await ProductModel.findById(
			inventory.inventory_productId,
		)
		const variant = await product.product_variants.find(
			(variant) => variant.sku === inventory.inventory_sku,
		)
		variant.quantity = inventory.inventory_stock
		variant.price = inventory.inventory_price
		variant.discount_price = inventory.inventory_discount_price
		variant.discount_percentage = Math.round(
			((inventory.inventory_price - inventory.inventory_discount_price) /
				inventory.inventory_price) *
				100,
		)

		await product.save()
	}

	private getSelectFields() {
		return '-__v -isMarkedDelete -inventory_shopId -inventory_parents -inventory_isActive -inventory_reservations -inventory_location -isMarkedDelete'
	}
}
