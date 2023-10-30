import { ValidateMongoObjectId } from '@libs'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Validate } from 'class-validator'

export class ObjectIdParam {
	@ApiProperty()
	@Validate(ValidateMongoObjectId, {
		message: 'Invalid Params',
	})
	@IsNotEmpty()
	id: string
}

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

	constructor(props: any) {
		Object.assign(this, props)
	}
}
