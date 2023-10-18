import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ObjectIdParam } from './dtos/common.dto'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SuccessResponseDTO } from '@libs'
import { BrandRepository } from '../database'
import {
	CreateBrandRequestDTO,
	CreateBrandResponseDTO,
} from './dtos/brand/create-brand.dtos'
import {
	FindBrandsQueryDTO,
	FindBrandsResponseDTO,
} from './dtos/brand/find-brands.dtos'
import { BrandDTO } from './dtos/brand/brand.dtos'
import { BrandNotFoundException } from '../errors/brand.errors'
import {
	UpdateBrandRequestDTO,
	UpdateBrandResponseDTO,
} from './dtos/brand/update-brand.dtos'

@Controller('v1/admin/brands')
@ApiTags('Admin - Brand')
@UseInterceptors(ClassSerializerInterceptor)
export class BrandController {
	constructor(private readonly brandRepo: BrandRepository) {}

	@Post()
	@ApiResponse({
		status: 201,
		type: CreateBrandResponseDTO,
	})
	async create(
		@Body() dto: CreateBrandRequestDTO,
	): Promise<CreateBrandResponseDTO> {
		const brand = await this.brandRepo.create({
			...dto,
		})
		return new CreateBrandResponseDTO({ data: brand })
	}

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

	@Put('/:id')
	async update(
		@Param() { id }: ObjectIdParam,
		@Body() body: UpdateBrandRequestDTO,
	): Promise<UpdateBrandResponseDTO> {
		const brand = await this.brandRepo.update({
			_id: id,
			...body,
		})
		if (!brand) {
			throw new BrandNotFoundException(id)
		}
		return new UpdateBrandResponseDTO({ data: brand })
	}

	@Delete('/:id')
	@ApiOkResponse({
		status: 200,
		type: SuccessResponseDTO,
	})
	async delete(@Param() { id }: ObjectIdParam): Promise<void> {
		const brandId = await this.brandRepo.deleteById(id)
		if (!brandId) {
			throw new BrandNotFoundException(id)
		}
		return
	}
}
