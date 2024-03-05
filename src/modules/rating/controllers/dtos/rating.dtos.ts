import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class RatingDTO {
	@ApiProperty()
	product_id: string

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

	@ApiProperty({
		required: false,
	})
	has_buy_product?: boolean = true

	@ApiProperty()
	user_id?: string

	@ApiProperty()
	avatar_user: string

	@ApiProperty()
	status: string

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

	constructor(data: Partial<RatingDTO>) {
		Object.assign(this, data)
	}
}

export class PaginationDTO<T> {
	data: T[]
	cursor: string
	size: number
	totalCount: number
}
