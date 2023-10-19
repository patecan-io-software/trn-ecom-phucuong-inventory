import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ProductDTO } from './common.dtos'
import { SuccessResponseDTO } from '@libs'
import { BrandDTO } from '@modules/admin/product/controllers/dtos/brand/brand.dtos'
import { Type } from 'class-transformer'
import { CategoryDTO } from '@modules/admin/product/controllers/dtos/common.dto'

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
	@Type(() => Object)
	filters: Record<string, any> = {}
}

export class FindProductsResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty()
	page: number

	@ApiProperty()
	page_size: number

	@ApiProperty()
	total_count: number

	@ApiProperty({
		type: [ProductDTO],
	})
	@Type(() => ProductDTO)
	items: ProductDTO[]

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
