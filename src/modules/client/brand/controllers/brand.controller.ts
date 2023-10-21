import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ObjectIdParam } from './dtos/common.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { BrandRepository } from '../database'
import {
	FindBrandsQueryDTO,
	FindBrandsResponseDTO,
} from './dtos/brand/find-brands.dtos'
import { BrandDTO } from './dtos/brand/brand.dtos'
import { BrandNotFoundException } from '../errors/brand.errors'

@Controller('v1/brands')
@ApiTags('Client - Brand')
@UseInterceptors(ClassSerializerInterceptor)
export class BrandController {
	constructor(private readonly brandRepo: BrandRepository) {}

	@Get()
	@ApiResponse({
		status: 200,
		type: FindBrandsResponseDTO,
	})
	async findBrands(
		@Query() query: FindBrandsQueryDTO,
	): Promise<FindBrandsResponseDTO> {
		const result = await this.brandRepo.find(query)
		return new FindBrandsResponseDTO(result)
	}

	@Get('/:id')
	@ApiResponse({
		status: 200,
		type: BrandDTO,
	})
	async getById(@Param() { id }: ObjectIdParam): Promise<BrandDTO> {
		const brand = await this.brandRepo.getById(id)
		if (!brand) {
			throw new BrandNotFoundException(id)
		}
		return new BrandDTO(brand)
	}
}
