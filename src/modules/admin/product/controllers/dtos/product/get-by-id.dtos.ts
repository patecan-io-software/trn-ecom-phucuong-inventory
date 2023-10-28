import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ProductDTO } from './product.dtos'
import { SuccessResponseDTO } from '@libs'
import { Type } from 'class-transformer'

export class GetProductByIdResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: ProductDTO,
	})
	@Type(() => ProductDTO)
	data: ProductDTO

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
