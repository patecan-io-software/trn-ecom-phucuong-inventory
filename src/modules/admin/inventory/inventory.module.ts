import { Module } from '@nestjs/common'
import { InventoryService } from './services/inventory.service'
import { InventoryRepository } from './database/inventory.repository'

@Module({
	providers: [InventoryService, InventoryRepository],
	exports: [InventoryService],
})
export class InventoryModule {}
