import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsArray, ValidateNested } from 'class-validator'
import { BrandDTO, BrandImage } from './brand.dtos'
import { SuccessResponseDTO } from '@libs'

export class UpdateBrandRequestDTO {
	@ApiProperty()
	brand_name: string

	@ApiProperty()
	brand_description: string

	@ApiProperty()
	brand_logoUrl: string

	@ApiProperty({
		required: false,
		default: [],
		type: [BrandImage],
	})
	@IsOptional()
	@IsArray()
	@Type(() => BrandImage)
	brand_images: BrandImage[] = []
}

export class UpdateBrandResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: BrandDTO,
	})
	@Type(() => BrandDTO)
	data: BrandDTO

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
