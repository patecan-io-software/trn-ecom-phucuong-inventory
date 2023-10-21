import { Global, Module } from '@nestjs/common'
import { InventoryService } from './services/inventory.service'
import { InventoryRepository } from './database/inventory.repository'
import { InventoryFactory } from './domain'

@Global()
@Module({
	providers: [InventoryService, InventoryRepository, InventoryFactory],
	exports: [InventoryService],
})
export class InventoryModule {}
