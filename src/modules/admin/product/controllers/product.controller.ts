import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseInterceptors,
} from '@nestjs/common'
import {
	CreateProductRequestDTO,
	CreateProductResponseDTO,
} from './dtos/product/create-product.dtos'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProductDTO } from './dtos/product/product.dtos'
import {
	UpdateProductRequestDTO,
	UpdateProductResponseDTO,
} from './dtos/product/update-product.dtos'
import { ObjectIdParam } from './dtos/common.dto'
import { SearchProductsResponseDTO } from '@modules/client/product/controllers/dtos/search-products.dtos'
import { SuccessResponseDTO } from '@libs'
import { ProductService } from '../services'
import { ProductRepository } from '../database'

@Controller('v1/admin/products')
@ApiTags('Admin - Product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly productRepo: ProductRepository,
	) {}

	@Post()
	@ApiResponse({
		status: 201,
		type: CreateProductResponseDTO,
	})
	async create(
		@Body() dto: CreateProductRequestDTO,
	): Promise<CreateProductResponseDTO> {
		const product = await this.productService.createProduct(dto)
		return new CreateProductResponseDTO({
			data: new ProductDTO(product),
		})
	}

	@Put('/:id')
	@ApiOkResponse({
		status: 200,
		type: UpdateProductResponseDTO,
	})
	async update(
		@Param() params: ObjectIdParam,
		@Body() dto: UpdateProductRequestDTO,
	): Promise<UpdateProductResponseDTO> {
		const product = await this.productService.updateProduct(params.id, dto)
		return new UpdateProductResponseDTO({ data: new ProductDTO(product) })
	}

	@Delete('/:id')
	@ApiResponse({
		status: 201,
		type: SuccessResponseDTO,
	})
	async deleteProductById(@Param() { id }: ObjectIdParam): Promise<void> {
		const products = await this.productService.deleteProduct(id)
		return
	}

	@Get('/search/:keyword')
	@ApiResponse({
		status: 201,
		type: ProductDTO,
	})
	async searchProductsByKeyword(
		@Param('keyword') keyword: string,
	): Promise<SearchProductsResponseDTO> {
		const products = await this.productRepo.searchProductsByKeyword(keyword)
		return new SearchProductsResponseDTO(products)
	}
}
