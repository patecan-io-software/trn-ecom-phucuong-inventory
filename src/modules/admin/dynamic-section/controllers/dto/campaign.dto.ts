import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsArray, IsNotEmpty } from 'class-validator'

import { SuccessResponseDTO } from '@libs'

export class CreateBrandRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	brand_name: string

	@ApiProperty()
	brand_description: string

	@ApiProperty()
	@IsNotEmpty()
	brand_logoUrl: string

}


