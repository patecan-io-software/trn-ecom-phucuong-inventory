import { OnEvent } from '@nestjs/event-emitter'
import { InventoryRepository } from '../database'
import { Injectable, Logger } from '@nestjs/common'
import { PRODUCT_EVENTS } from '../constants'

export interface OnProductDeletedEvent {
	productId: string
}

@Injectable()
export class OnProductDeletedEventHandler {
	private readonly logger = new Logger(OnProductDeletedEventHandler.name)
	constructor(private readonly inventoryRepo: InventoryRepository) {}

	@OnEvent(PRODUCT_EVENTS.OnDeleted)
	async handle(event: OnProductDeletedEvent) {
		try {
			const { productId } = event

			await this.inventoryRepo.batchDeleteByProductId(productId)
		} catch (error) {
			this.logger.error(error)
		}
	}
}
