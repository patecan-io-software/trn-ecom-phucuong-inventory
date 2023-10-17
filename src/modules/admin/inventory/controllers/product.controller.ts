import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Param,
	Post,
	Put,
	UseInterceptors,
} from '@nestjs/common'
import {
	CreateProductRequestDTO,
	CreateProductResponseDTO,
} from './dtos/product/create-product.dtos'
import { InventoryService } from '../services'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProductDTO } from './dtos/product/product.dtos'
import {
	UpdateProductRequestDTO,
	UpdateProductResponseDTO,
} from './dtos/product/update-product.dtos'
import { ObjectIdParam } from './dtos/common.dto'

@Controller('v1/products')
@ApiTags('Admin - Product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
	constructor(private readonly inventoryService: InventoryService) {}

	@Post()
	@ApiResponse({
		status: 201,
		type: CreateProductResponseDTO,
	})
	async create(
		@Body() dto: CreateProductRequestDTO,
	): Promise<CreateProductResponseDTO> {
		const product = await this.inventoryService.createProduct(dto)
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
		const product = await this.inventoryService.updateProduct(
			params.id,
			dto,
		)
		return new UpdateProductResponseDTO({ data: new ProductDTO(product) })
	}
}
