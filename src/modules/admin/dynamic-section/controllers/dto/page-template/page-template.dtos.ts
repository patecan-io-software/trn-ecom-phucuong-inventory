import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator'

export class PageSectionDTO {
	@ApiProperty()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsNotEmpty()
	type: string

	@ApiProperty()
	@IsOptional()
	@Type(() => Boolean)
	is_active: boolean = true;

	[key: string]: any
}

export class ImageDTO {
	@ApiProperty()
	@IsNotEmpty()
	image_url: string

	@ApiProperty()
	@IsNotEmpty()
	display_text: string

	@ApiProperty()
	@IsOptional()
	link_url: string
}

export class ImageSectionDTO extends PartialType(PageSectionDTO) {
	@ApiProperty({
		type: [ImageDTO],
	})
	@IsArray()
	@IsNotEmpty()
	image_list: ImageDTO[]

	@ApiProperty({
		isArray: true,
		items: {
			type: 'string',
		},
	})
	@IsArray()
	@IsOptional()
	@Transform(({ value }) => value || [])
	background_image_list: string[]
}

export class FooterSectionDTO extends PartialType(PageSectionDTO) {
	@ApiProperty()
	@IsNotEmpty()
	background_image_url: string

	@ApiProperty()
	display_text: string
}

export class LogoSectionDTO extends PartialType(PageSectionDTO) {
	@ApiProperty()
	@IsNotEmpty()
	favicon: string

	@ApiProperty()
	@IsNotEmpty()
	logo: string
}

export class PageTemplateDTO {
	@ApiProperty()
	name: string

	@ApiProperty({
		type: [PageSectionDTO],
	})
	@Type(() => PageSectionDTO)
	section_list: PageSectionDTO[]

	@ApiProperty({
		type: 'number',
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	createdAt: Date

	@ApiProperty({
		type: 'number',
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	updatedAt: Date

	constructor(props: Partial<PageTemplateDTO>) {
		Object.assign(this, props)
	}
}
