import { ApiProperty } from '@nestjs/swagger'
import { DateStringToTimestamp } from '@libs'

export class InventoryDTO {
	@ApiProperty()
	_id: string

	@ApiProperty()
	inventory_sku: string

	@ApiProperty()
	inventory_productId: string

	@ApiProperty()
	product_name: string

	@ApiProperty()
	inventory_stock: number

	@ApiProperty()
	inventory_price: number

	@ApiProperty()
	inventory_discount_price: number

	@ApiProperty({
		type: Number,
	})
	@DateStringToTimestamp()
	createdAt: Date

	@ApiProperty({
		type: Number,
	})
	@DateStringToTimestamp()
	updatedAt: Date
}
