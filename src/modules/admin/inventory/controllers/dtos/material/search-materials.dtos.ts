import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ProductMaterialDTO } from './material.dtos'

export class SearchMaterialsQueryDTO {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform((params) => (!params.value ? '' : params.value))
	material_name: string = ''

	@ApiProperty({
		required: false,
	})
	@Type(() => Number)
	page: number = 1

	@ApiProperty({
		required: false,
	})
	@Type(() => Number)
	page_size: number = 20
}

export class SearchMaterialsResponseDTO extends PartialType(
	SuccessResponseDTO,
) {
	@ApiProperty()
	page: number

	@ApiProperty()
	page_size: number

	@ApiProperty()
	total_count: number

	@ApiProperty({
		type: [ProductMaterialDTO],
	})
	@Type(() => ProductMaterialDTO)
	items: ProductMaterialDTO[]

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
