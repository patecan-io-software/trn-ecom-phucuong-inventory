import { SuccessResponseDTO, ValidateNonNegative } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { InventoryDTO } from './inventory.dtos'
import { IsNumber, Validate, ValidateIf, isEmpty } from 'class-validator'

export class UpdateInventoryQueryDTO {
	@ApiProperty()
	inventory_stock: string
}

export class UpdateInventoryRequestDTO {
	@ApiProperty()
	@IsNumber({
		allowInfinity: false,
		allowNaN: false,
		maxDecimalPlaces: 0,
	})
	@Validate(ValidateNonNegative)
	@ValidateIf((obj, val) => !isEmpty(val))
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
