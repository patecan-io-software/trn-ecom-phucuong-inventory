import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import {
	SearchInventoriesQueryDTO,
	SearchInventoriesResponseDTO,
} from './dtos/search-inventories.dtos'
import { InventoryRepository } from '../database'
import { ApiTags } from '@nestjs/swagger'
import { AdminAuth, AuthGuard } from '@modules/admin/auth'

@Controller('/v1/admin/inventories')
@ApiTags('Admin - Inventory')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('apiKey')
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
