import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CategoryTreeDTO } from './common.dto'
import { Type } from 'class-transformer'

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
