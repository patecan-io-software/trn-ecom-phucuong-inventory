import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ProductDetailResponseDTO } from './product.dtos'
import { ResultCode } from 'src/libs/enums/result-code.enum'

export class GetProductDetailResponseDTO extends PartialType(
	ProductDetailResponseDTO,
) {
	@ApiProperty()
	resultCode: string

	@ApiProperty()
	message: string

	constructor(props: any) {
		super(props)
		this.resultCode = ResultCode.Success
		this.message = 'Success'
	}
}
