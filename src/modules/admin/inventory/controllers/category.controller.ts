import { Body, Controller, Post } from '@nestjs/common'
import { InventoryService } from '../services/inventory.service'

@Controller('category')
export class CategoryController {
	constructor(private readonly inventoryService: InventoryService) {}

	@Post()
	async create(@Body() dto: any) {
		const category = await this.inventoryService.createCategory(dto)
		return category
	}
}
