import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { InventoryDTO } from './inventory.dtos'

export class UpdateInventoryRequestDTO {
	@ApiProperty()
	inventory_stock: number
}

export class UpdateInventoryResponseDTO extends PartialType(
	SuccessResponseDTO,
) {
	@ApiProperty({
		type: InventoryDTO,
	})
	@Type(() => InventoryDTO)
	data: InventoryDTO

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
