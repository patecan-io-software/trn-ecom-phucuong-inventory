import { ApiProperty } from '@nestjs/swagger'

export class SuccessResponseDTO {
	@ApiProperty()
	resultCode: string
}

export class ErrorResponseDTO {
	@ApiProperty()
	resultCode: string

	@ApiProperty()
	code: string

	@ApiProperty()
	message: string
}
