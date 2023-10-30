import { SuccessResponseDTO, ValidateNonNegative } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { InventoryDTO } from './inventory.dtos'
import { IsNotEmpty, IsNumber, Validate } from 'class-validator'

export class UpdateInventoryRequestDTO {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Validate(ValidateNonNegative)
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
