import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	IPaginationResult,
	SuccessResponseDTO,
	TransformQueryString,
} from '@libs'
import { Transform, Type } from 'class-transformer'
import { ClientProductDTO } from './product.dtos'
import { IsMongoId, IsOptional } from 'class-validator'

export class FindProductsQueryDTO {
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

	@ApiProperty({
		required: false,
	})
	@Transform(TransformQueryString)
	q: string

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@Transform(TransformQueryString)
	category: string

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsMongoId()
	@Transform(TransformQueryString)
	brand: string

	@ApiProperty({
		required: false,
	})
	@Type(() => Number)
	priceMin: number

	@ApiProperty({
		required: false,
	})
	@Type(() => Number)
	priceMax: number

	@ApiProperty({
		required: false,
	})
	@Type(() => Object)
	filters: Record<string, any> = {}
}

export class FindProductsResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: [ClientProductDTO],
	})
	@Type(() => ClientProductDTO)
	items: ClientProductDTO[]

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
