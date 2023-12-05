import { Global, Module } from '@nestjs/common'
import { InventoryService } from './services/inventory.service'
import { InventoryRepository } from './database/inventory.repository'
import { InventoryFactory } from './domain'
import { InventoryController } from './controllers/inventory.controller'
import { OnProductCreatedEventHandler } from './event-handlers/on-product-created.event-handler'
import { OnProductUpdatedEventHandler } from './event-handlers/on-product-updated.event-handler'
import { OnProductDeletedEventHandler } from './event-handlers/on-product-deleted.event-handler'

@Global()
@Module({
	providers: [
		InventoryService,
		InventoryRepository,
		InventoryFactory,
		OnProductCreatedEventHandler,
		OnProductUpdatedEventHandler,
		OnProductDeletedEventHandler,
	],
	controllers: [InventoryController],
	exports: [InventoryService],
})
export class InventoryModule {}
