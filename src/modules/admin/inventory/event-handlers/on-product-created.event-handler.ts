import { OnEvent } from '@nestjs/event-emitter'
import { InventoryRepository } from '../database'
import { Injectable, Logger } from '@nestjs/common'
import { InventoryFactory, ProductVariant } from '../domain'
import { PRODUCT_EVENTS } from '../constants'

export interface OnProductCreatedEvent {
	productId: string
	variantList: ProductVariant[]
}

@Injectable()
export class OnProductCreatedEventHandler {
	private readonly logger = new Logger(OnProductCreatedEventHandler.name)
	constructor(
		private readonly inventoryRepo: InventoryRepository,
		private readonly inventoryFactory: InventoryFactory,
	) {}

	@OnEvent(PRODUCT_EVENTS.OnCreated)
	async handle(event: OnProductCreatedEvent) {
		try {
			const { productId, variantList } = event

			const inventoryList = variantList.map((variant) =>
				this.inventoryFactory.createInventoryForProductVariant(
					productId,
					variant,
				),
			)

			await this.inventoryRepo.saveBatch(inventoryList)
		} catch (e) {
			this.logger.error(e)
		}
	}
}
