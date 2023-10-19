import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CategoryDTO, CategoryImage } from './common.dto'
import { SuccessResponseDTO } from '@libs'
import { Expose, Type } from 'class-transformer'

export class CreateCategoryRequestDTO {
	@ApiProperty()
	@Expose()
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
