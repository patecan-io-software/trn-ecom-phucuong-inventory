import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CategoryDTO } from './common.dto'
import { Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class FindCategoriesQueryDTO {
	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform((params) => (!params.value ? '' : params.value))
	category_name: string = ''

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

export class FindCategoriesResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty()
	page: number

	@ApiProperty()
	page_size: number

	@ApiProperty()
	total_count: number

	@ApiProperty({
		type: [CategoryDTO],
	})
	@Type(() => CategoryDTO)
	items: CategoryDTO[]

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
