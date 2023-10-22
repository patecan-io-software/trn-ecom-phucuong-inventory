import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import {
	SearchInventoriesQueryDTO,
	SearchInventoriesResponseDTO,
} from './dtos/search-inventories.dtos'
import { InventoryRepository } from '../database'
import { ApiTags } from '@nestjs/swagger'

@Controller('/v1/admin/inventories')
@ApiTags('Admin - Inventory')
@UseInterceptors(ClassSerializerInterceptor)
export class InventoryController {
	constructor(private readonly inventoryRepo: InventoryRepository) {}

	@Get()
	async searchInventories(
		@Query() q: SearchInventoriesQueryDTO,
	): Promise<SearchInventoriesResponseDTO> {
		const results = await this.inventoryRepo.searchInventories(q)
		return new SearchInventoriesResponseDTO(results)
	}
}
