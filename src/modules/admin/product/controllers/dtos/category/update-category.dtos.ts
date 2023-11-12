import { ApiProperty, PartialType } from '@nestjs/swagger'
import { SuccessResponseDTO } from '@libs'
import { Type } from 'class-transformer'
import { CategoryImage, CategoryDTO } from './category.dtos'

export class UpdateCategoryRequestDTO {
	@ApiProperty()
	parent_id: string

	@ApiProperty()
	category_name: string

	@ApiProperty()
	category_description: string

	@ApiProperty()
	category_logoUrl: string

	@ApiProperty({
		type: [CategoryImage],
	})
	category_images: CategoryImage[]
}

export class UpdateCategoryResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: CategoryDTO,
	})
	@Type(() => CategoryDTO)
	data: CategoryDTO

	constructor(props: Partial<UpdateCategoryResponseDTO>) {
		super(props)
		Object.assign(this, props)
	}
}
