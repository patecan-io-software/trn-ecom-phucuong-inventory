import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class CategoryImage {
	@ApiProperty()
	imageName: string

	@ApiProperty()
	imageUrl: string
}

export class CategoryDTO {
	@ApiProperty()
	_id: string

	@ApiProperty()
	category_name: string

	@ApiProperty({
		required: false,
	})
	category_description: string

	@ApiProperty()
	parent_id: string

	@ApiProperty({
		required: false,
	})
	category_logoUrl: string

	@ApiProperty({
		type: [CategoryImage],
	})
	category_images: CategoryImage[]

	@ApiProperty({
		required: false,
	})
	category_isActive: boolean = true

	@ApiProperty({
		type: 'number',
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	createdAt?: Date

	@ApiProperty({
		type: 'number',
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	updatedAt?: Date

	@ApiProperty({
		type: () => CategoryDTO,
	})
	parent_category?: CategoryDTO

	constructor(props: any) {
		Object.assign(this, props)
	}
}
