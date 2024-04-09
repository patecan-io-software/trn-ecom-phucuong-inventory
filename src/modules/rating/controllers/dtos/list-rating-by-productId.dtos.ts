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
	cursor: string | null
	size: number

	constructor(lisMyRating: M[], cursor: string | null, size: number) {
		this.lisMyRating = lisMyRating
		this.cursor = cursor
		this.size = size
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
	cursor: string

	@ApiProperty()
	@IsNotEmpty()
	size: number

	constructor(lisMyRating: PaginationMyRatingDTO<RatingDTO>) {
		this.lisMyRating = lisMyRating
	}
}
