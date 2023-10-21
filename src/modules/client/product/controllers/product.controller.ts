import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetProductDetailResponseDTO } from './dtos/product/get-product-detail.dtos'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
	FindProductsQueryDTO,
	FindProductsResponseDTO,
} from './dtos/product/find-products.dtos'
import { ProductRepository } from '../database'
import { IPaginationResult } from '@libs'
import { ProductNotFoundException } from '../errors/product.errors'
import { isMongoId } from 'class-validator'
import { ObjectIdParam } from './dtos/common.dtos'

@Controller('v1/products')
@ApiTags('Client - Product')
export class ProductController {
	constructor(private readonly productRepo: ProductRepository) {}

	@Get()
	@ApiResponse({
		status: 200,
		type: FindProductsResponseDTO,
	})
	async findProducts(
		@Query() query: FindProductsQueryDTO,
	): Promise<FindProductsResponseDTO> {
		let result: IPaginationResult
		if (query.q) {
			result = await this.productRepo.searchProductsByKeyword({
				keyword: query.q,
				...query,
			})
		} else {
			result = await this.productRepo.find(query)
		}
		return new FindProductsResponseDTO(result)
	}

	@Get('/:id')
	@ApiResponse({
		status: 200,
		type: GetProductDetailResponseDTO,
	})
	async getById(
		@Param() { id }: ObjectIdParam,
	): Promise<GetProductDetailResponseDTO> {
		let product: any
		const queryById = isMongoId(id)
		if (queryById) {
			product = await this.productRepo.getById(id)
		} else {
			product = await this.productRepo.getBySlug(id)
		}
		if (!product) {
			throw new ProductNotFoundException(id, queryById)
		}
		return new GetProductDetailResponseDTO({ data: product })
	}
}
