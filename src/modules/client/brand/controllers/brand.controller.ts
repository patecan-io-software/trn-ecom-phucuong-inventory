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
	FindBrandsQueryDTO,
	FindBrandsResponseDTO, SearchBrandsResponseDTO,
} from './dtos/brand/find-brands.dtos'
import { BrandDTO } from './dtos/brand/brand.dtos'
import { BrandNotFoundException } from '../errors/brand.errors'
import { ProductDTO } from '@modules/client/product/controllers/dtos/common.dtos'
import { SearchProductsResponseDTO } from '@modules/client/product/controllers/dtos/search-products.dtos'
import { FindProductsResponseDTO } from '@modules/client/product/controllers/dtos/find-products-query.dtos'
import { ProductRepository } from '@modules/client/product/database'


@Controller('v1/brands')
@ApiTags('Client - Brand')
@UseInterceptors(ClassSerializerInterceptor)
export class BrandController {
	constructor(
		private readonly brandRepo: BrandRepository,
		private readonly productRepository: ProductRepository
				) {}

	@Get('/search/:keyword')
	@ApiResponse({
		status: 201,
		type: BrandDTO,
	})
	async searchBrandsByKeyword(@Param('keyword') keyword: string): Promise<SearchBrandsResponseDTO> {
		const brands = await this.brandRepo.searchBrandsByKeyword(keyword)
		return new SearchBrandsResponseDTO(brands)
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

	@Get('/:id/products')
	@ApiResponse({
		status: 201,
		type: FindProductsResponseDTO,
	})
	async findProductsByCategoryId(
		@Param('id') brandId: string,
		@Query() query: { page: number; page_size: number; filters: Record<string, any> },
	): Promise<FindProductsResponseDTO> {
		const result = await this.productRepository.findByBrandId(brandId, query)
		return new FindProductsResponseDTO(result)
	}

}
