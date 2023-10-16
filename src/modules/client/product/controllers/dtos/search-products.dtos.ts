import { ApiProperty } from '@nestjs/swagger'
import { ProductDTO } from './common.dtos'

export class SearchProductsQueryDTO {
	@ApiProperty({
		required: false,
		default: 1,
	})
	page: number

	@ApiProperty({
		required: false,
		default: 10,
	})
	page_size: number
}

export class SearchProductsResponseDTO {
	@ApiProperty()
	resultCode: string

	@ApiProperty()
	resultMessage: string

	@ApiProperty({
		type: [ProductDTO],
	})
	items: ProductDTO[]

	@ApiProperty()
	total_count: number

	@ApiProperty()
	page: number

	@ApiProperty()
	page_size: number
}
