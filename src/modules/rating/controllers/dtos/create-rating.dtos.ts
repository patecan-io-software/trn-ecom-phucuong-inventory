import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { RatingDTO } from './rating.dtos'

export class CreateRatingRequestDTO {
	@ApiProperty()
	product_id: string

	@ApiProperty()
	product_name: string

	@ApiProperty()
	product_image: string

	@ApiProperty({ type: 'number' })
	rating: number

	@ApiProperty()
	comment: string

	@ApiProperty()
	name: string

	@ApiProperty()
	email?: string

	@ApiProperty({ type: 'number' })
	phone?: number

	@ApiProperty()
	has_buy_product?: boolean = true

	@ApiProperty()
	user_id?: string

	@ApiProperty()
	avatar_user: string
}

export class CreateRatingResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: RatingDTO,
	})
	@Type(() => RatingDTO)
	@Expose()
	data: RatingDTO

	constructor(props: any) {
		super(props)
		Object.assign(this, props)
	}
}
