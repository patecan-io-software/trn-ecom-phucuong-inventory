import {
	Body,
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
	UpdateInventoryQueryDTO,
	UpdateInventoryRequestDTO,
	UpdateInventoryResponseDTO,
} from './dtos/update-inventory.dtos'
import { InventoryService } from '../services/inventory.service'
import { isNotEmptyObject, validate } from 'class-validator'
import { BadRequestException } from '@libs'
import { plainToInstance } from 'class-transformer'

@Controller('/v1/admin/inventories')
@ApiTags('Admin - Inventory')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('jwtToken')
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
		@Query() queryDTO: UpdateInventoryQueryDTO,
		@Body() body: UpdateInventoryRequestDTO,
	): Promise<UpdateInventoryResponseDTO> {
		let dto: UpdateInventoryRequestDTO
		// TODO: Query is used by mistake instead of request body. Will be replaced in the future with respective request body
		if (isNotEmptyObject(queryDTO)) {
			dto = plainToInstance(
				UpdateInventoryRequestDTO,
				{
					inventory_stock: queryDTO.inventory_stock,
				},
				{
					enableImplicitConversion: true,
				},
			)
			const validateResult = await validate(dto)
			if (validateResult.length > 0) {
				throw new BadRequestException(validateResult)
			}
		} else {
			dto = body
		}
		const result = await this.inventoryService.updateInventory(sku, dto)
		return new UpdateInventoryResponseDTO({ data: result })
	}
}
