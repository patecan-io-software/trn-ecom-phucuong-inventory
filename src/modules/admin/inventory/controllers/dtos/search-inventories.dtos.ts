import { SuccessResponseDTO, TransformQueryString } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { InventoryDTO } from './inventory.dtos'

export class SearchInventoriesQueryDTO {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform(TransformQueryString)
	inventory_sku: string

	@ApiProperty({
		required: false,
		default: 1,
	})
	@Type(() => Number)
	page: number = 1

	@ApiProperty({
		required: false,
		default: 10,
	})
	@Type(() => Number)
	page_size: number = 10
}

export class SearchInventoriesResponseDTO extends PartialType(
	SuccessResponseDTO,
) {
	@ApiProperty({
		type: [InventoryDTO],
	})
	@Type(() => InventoryDTO)
	items: InventoryDTO[]

	@ApiProperty()
	total_count: number

	@ApiProperty()
	page: number

	@ApiProperty()
	page_size: number

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
