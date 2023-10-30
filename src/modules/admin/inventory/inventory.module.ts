import { Global, Module } from '@nestjs/common'
import { InventoryService } from './services/inventory.service'
import { InventoryRepository } from './database/inventory.repository'
import { InventoryFactory } from './domain'
import { InventoryController } from './controllers/inventory.controller'

@Global()
@Module({
	providers: [InventoryService, InventoryRepository, InventoryFactory],
	controllers: [InventoryController],
	exports: [InventoryService],
})
export class InventoryModule {}
