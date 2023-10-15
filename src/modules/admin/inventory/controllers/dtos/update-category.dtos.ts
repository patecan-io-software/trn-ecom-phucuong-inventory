import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CategoryDTO, CategoryImage } from './common.dto'
import { SuccessResponseDTO } from '@libs'
import { Type } from 'class-transformer'

export class UpdateCategoryRequestDTO {
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
