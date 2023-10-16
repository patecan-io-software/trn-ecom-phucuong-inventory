import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { BrandDTO } from './brand.dtos'

export class FindBrandsQueryDTO {
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

export class FindBrandsResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty()
	page: number

	@ApiProperty()
	page_size: number

	@ApiProperty()
	total_count: number

	@ApiProperty({
		type: [BrandDTO],
	})
	@Type(() => BrandDTO)
	items: BrandDTO[]

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
