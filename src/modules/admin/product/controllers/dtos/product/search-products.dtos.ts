import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ProductDTO } from './product.dtos'
import { SuccessResponseDTO, TransformQueryString } from '@libs'
import { Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class SearchProductsQueryDTO {
	@ApiProperty({
		required: false,
		description: 'Search by product name, description',
	})
	@IsOptional()
	@Transform(TransformQueryString)
	q: string

	@ApiProperty({
		required: false,
		description:
			'Search by product sku. Result only contain 1 product or empty if not found',
	})
	@IsOptional()
	@Transform(TransformQueryString)
	sku: string

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

export class SearchProductsResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty()
	resultCode: string

	@ApiProperty()
	resultMessage: string

	@ApiProperty({
		type: [ProductDTO],
	})
	@Type(() => ProductDTO)
	items: ProductDTO[]

	@ApiProperty()
	total_count: number

	@ApiProperty()
	page: number

	@ApiProperty()
	page_size: number

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
		this.items = props.items.map((item) => new ProductDTO(item))
	}
}
