import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsOptional } from 'class-validator'

export class BrandImage {
	@ApiProperty()
	imageName: string

	@ApiProperty()
	imageUrl: string
}

export class BrandDTO {
	@ApiProperty()
	_id: string

	@ApiProperty()
	brand_name: string

	@ApiProperty()
	brand_description: string

	@ApiProperty()
	brand_logoUrl: string

	@ApiProperty({
		required: false,
		type: [BrandImage],
	})
	@IsOptional()
	@IsArray()
	@Type(() => BrandImage)
	brand_images: BrandImage[] = []

	@ApiProperty()
	brand_isActive: boolean

	@ApiProperty()
	@Transform(({ value }) => value?.getTime?.() || null)
	createdAt?: Date

	@ApiProperty()
	@Transform(({ value }) => value?.getTime?.() || null)
	updatedAt?: Date

	constructor(props: any) {
		Object.assign(this, props)
	}
}
