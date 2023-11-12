import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsOptional, IsArray, IsNotEmpty, IsNumber } from 'class-validator'

import { SuccessResponseDTO } from '@libs'

export class CommonImage {
	@ApiProperty()
	imageName: string

	@ApiProperty()
	imageUrl: string
}

export class CampaignDTO {
	@ApiProperty()
	_id: string

	@ApiProperty()
	@IsNotEmpty()
	campaign_name: string

	@ApiProperty()
	campaign_content: string

	@ApiProperty({
		required: false,
		type: [CommonImage],
	})
	@IsOptional()
	@IsArray()
	@Type(() => CommonImage)
	campaign_images: CommonImage[] = []

	@ApiProperty()
	campaign_link: string

	@ApiProperty()
	campaign_isActive: boolean

	@ApiProperty()
	isMarkedDelete: boolean

	@ApiProperty({
		type: Number,
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	startDate?: Date

	@ApiProperty({
		type: Number,
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	endDate?: Date

	@ApiProperty({
		type: Number,
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	createdAt: Date

	@ApiProperty({
		type: Number,
	})
	@Transform(({ value }) => value?.getTime?.() || null)
	updatedAt: Date

	constructor(props: any) {
		Object.assign(this, props)
	}
}

export class CreateCampaignRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	campaign_name: string

	@ApiProperty()
	campaign_content: string

	@ApiProperty({
		required: false,
		type: [CommonImage],
	})
	@IsOptional()
	@IsArray()
	@Type(() => CommonImage)
	campaign_images: CommonImage[] = []

	@ApiProperty()
	campaign_link: string

	@ApiProperty()
	campaign_isActive: boolean

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	startDate: number

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	endDate: number
}

export class CreateCampaignResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: CampaignDTO,
	})
	@Type(() => CampaignDTO)
	data: CampaignDTO

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
