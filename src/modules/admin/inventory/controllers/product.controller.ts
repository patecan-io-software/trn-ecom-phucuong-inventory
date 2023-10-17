import { Body, Controller, Post } from '@nestjs/common'
import { CreateProductRequestDTO } from './dtos/product/create-product.dtos'
import { InventoryService } from '../services'

@Controller('v1/products')
export class ProductController {
	constructor(private readonly inventoryService: InventoryService) {}

	@Post()
	async create(@Body() dto: CreateProductRequestDTO) {
		const product = await this.inventoryService.createProduct(dto)
		return product
	}

	@Post()
	async update(@Body() dto: CreateProductRequestDTO) {}
}
