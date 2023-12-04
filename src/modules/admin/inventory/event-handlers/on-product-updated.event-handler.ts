import { OnEvent } from '@nestjs/event-emitter'
import { InventoryRepository } from '../database'
import { Injectable, Logger } from '@nestjs/common'
import { InventoryFactory, ProductVariant } from '../domain'
import { PRODUCT_EVENTS } from '../constants'

export interface OnProductUpdatedEvent {
	productId: string
	newVariantList: ProductVariant[]
	updatedVariantList: ProductVariant[]
	deletedVariantList: ProductVariant[]
}

@Injectable()
export class OnProductUpdatedEventHandler {
	private readonly logger = new Logger(OnProductUpdatedEventHandler.name)
	constructor(
		private readonly inventoryRepo: InventoryRepository,
		private readonly inventoryFactory: InventoryFactory,
	) {}

	@OnEvent(PRODUCT_EVENTS.OnUpdated)
	async handle(event: OnProductUpdatedEvent) {
		await this.inventoryRepo.startTransaction()
		try {
			const {
				productId,
				deletedVariantList,
				newVariantList,
				updatedVariantList,
			} = event

			const deletedInventorySKUList = deletedVariantList.map(
				(variant) => variant.sku,
			)
			const updatedAndNewInventoryList = [
				...updatedVariantList,
				...newVariantList,
			].map((variant) =>
				this.inventoryFactory.createInventoryForProductVariant(
					productId,
					variant,
				),
			)

			await Promise.all([
				this.inventoryRepo.batchDeleteBySKUs(deletedInventorySKUList),
				this.inventoryRepo.saveBatch(updatedAndNewInventoryList),
			])

			await this.inventoryRepo.commitTransaction()
		} catch (e) {
			this.logger.error(e)
			await this.inventoryRepo.abortTransaction()
		}
	}
}
