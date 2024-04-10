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

export class PaginationMyRatingDTO<M> {
	lisMyRating: M[]
	size: number
	cursor: string | null

	constructor(lisMyRating: M[], cursor: string | null, size: number) {
		this.lisMyRating = lisMyRating
		this.size = size
		this.cursor = cursor
	}
}

export class MyRatingDTO {
	@ApiProperty({
		description: 'Product Id',
	})
	product_id: string

	@ApiProperty({
		description: 'User Id',
	})
	user_id: string

	constructor(product_id: string, user_id: string) {
		this.product_id = product_id
		this.user_id = user_id
	}
}

export class MyRatingResponseDTO {
	@ApiProperty({
		description: 'List of ratings',
		type: [RatingDTO],
	})
	@IsNotEmpty()
	lisMyRating: PaginationMyRatingDTO<RatingDTO>

	@ApiProperty()
	@IsNotEmpty()
	size: number

	@ApiProperty()
	cursor: string

	constructor(lisMyRating: PaginationMyRatingDTO<RatingDTO>) {
		this.lisMyRating = lisMyRating
	}
}
