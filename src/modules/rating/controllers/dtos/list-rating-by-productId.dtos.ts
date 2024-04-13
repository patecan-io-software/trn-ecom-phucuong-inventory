import { ApiProperty } from '@nestjs/swagger'
import { RatingDTO } from './rating.dtos'
import { IsIn, IsNotEmpty } from 'class-validator'

export class PaginationListRatingByProductIdDTO<L> {
	listRating: L[]
	cursor: string | null
	size: number

	constructor(listRating: L[], cursor: string | null, size: number) {
		this.listRating = listRating
		this.cursor = cursor
		this.size = size
	}
}

export class ListRatingByProductIdDTO {
	@ApiProperty({
		description: 'Product Id',
	})
	product_id: string

	constructor(product_id: string) {
		this.product_id = product_id
	}
}

export class ListRatingByProductIdResponseDTO {
	@ApiProperty({
		description: 'List of ratings by product ID',
		type: PaginationListRatingByProductIdDTO<RatingDTO>,
	})
	@IsNotEmpty()
	listRating: PaginationListRatingByProductIdDTO<RatingDTO>

	constructor(listRating: PaginationListRatingByProductIdDTO<RatingDTO>) {
		this.listRating = listRating
	}
}

export class PaginationUserRatingDTO {
	@ApiProperty()
	items: RatingDTO[]

	@ApiProperty()
	pageSize: number

	@ApiProperty({ required: false })
	cursor?: string

	constructor(data: PaginationUserRatingDTO) {
		Object.assign(this, data)
	}
}

export class UserRatingResponseDTO {
	@ApiProperty()
	items: RatingDTO[]

	@ApiProperty()
	pageSize: number

	@ApiProperty()
	cursor?: string

	constructor(data: UserRatingResponseDTO) {
		Object.assign(this, data)
	}
}
