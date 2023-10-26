import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Put,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import {
	SearchInventoriesQueryDTO,
	SearchInventoriesResponseDTO,
} from './dtos/search-inventories.dtos'
import { InventoryRepository } from '../database'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminAuth } from '@modules/admin/auth'
import {
	UpdateInventoryRequestDTO,
	UpdateInventoryResponseDTO,
} from './dtos/update-inventory.dtos'
import { InventoryService } from '../services/inventory.service'

@Controller('/v1/admin/inventories')
@ApiTags('Admin - Inventory')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('apiKey')
export class InventoryController {
	constructor(
		private readonly inventoryRepo: InventoryRepository,
		private readonly inventoryService: InventoryService,
	) {}

	@Get()
	@ApiResponse({
		status: 200,
		type: SearchInventoriesResponseDTO,
	})
	async searchInventories(
		@Query() q: SearchInventoriesQueryDTO,
	): Promise<SearchInventoriesResponseDTO> {
		const results = await this.inventoryRepo.searchInventories(q)
		return new SearchInventoriesResponseDTO(results)
	}

	@Put(':sku')
	async updateInventory(
		@Param('sku') sku: string,
		@Query() dto: UpdateInventoryRequestDTO,
	): Promise<UpdateInventoryResponseDTO> {
		const result = await this.inventoryService.updateInventory(sku, dto)
		return new UpdateInventoryResponseDTO({ data: result })
	}
}
