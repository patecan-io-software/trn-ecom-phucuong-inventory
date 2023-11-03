import { ApiProperty, PartialType } from '@nestjs/swagger'
import { SuccessResponseDTO } from '@libs'
import { Expose, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { CategoryDTO, CategoryImage } from './category.dtos'

export class CreateCategoryRequestDTO {
	@ApiProperty()
	@Expose()
	category_name: string

	@ApiProperty({
		required: false,
		default: null,
	})
	@IsOptional()
	parent_id: string = null

	@ApiProperty()
	category_description: string

	@ApiProperty()
	category_logoUrl: string

	@ApiProperty({
		type: [CategoryImage],
	})
	category_images: CategoryImage[]
}

export class CreateCategoryResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: CategoryDTO,
	})
	@Type(() => CategoryDTO)
	@Expose()
	data: CategoryDTO

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
