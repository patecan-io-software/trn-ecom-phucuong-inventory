import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
	SearchMaterialsQueryDTO,
	SearchMaterialsResponseDTO,
} from './dtos/material/search-materials.dtos'
import { ProductRepository } from '../database'

@Controller('v1/admin/materials')
@ApiTags('Admin - Material')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductMaterialController {
	constructor(private readonly productRepo: ProductRepository) {}

	@Get()
	@ApiResponse({
		status: 200,
		type: SearchMaterialsResponseDTO,
	})
	async searchMaterials(
		@Query() dto: SearchMaterialsQueryDTO,
	): Promise<SearchMaterialsResponseDTO> {
		const result = await this.productRepo.findMaterials(dto)
		return new SearchMaterialsResponseDTO(result)
	}
}
