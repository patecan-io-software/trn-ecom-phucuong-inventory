import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CategoryTreeDTO } from './common.dto'
import { Transform, Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'

export class GetCategoryTreeQueryDTO {
	@ApiProperty({
		required: false,
		enum: ['full', 'simple'],
	})
	@IsEnum(['full', 'simple'])
	@IsOptional()
	@Transform(({ value }) => value || 'simple')
	view?: string
}

export class GetCategoryTreeResponseDTO extends PartialType(
	SuccessResponseDTO,
) {
	@ApiProperty({
		type: [CategoryTreeDTO],
	})
	@Type(() => CategoryTreeDTO)
	items: CategoryTreeDTO[]

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
