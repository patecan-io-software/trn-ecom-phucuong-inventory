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

export class PaginationUserRatingDTO<M> {
	listMyRating: RatingDTO[]
	pageSize: number
	cursor: string | null

	constructor(
		listMyRating: RatingDTO[],
		cursor: string | null,
		pageSize: number,
	) {
		this.listMyRating = listMyRating
		this.pageSize = pageSize
		this.cursor = cursor
	}
}

export class UserRatingResponseDTO {
	@ApiProperty({
		description: 'List of ratings',
		type: [RatingDTO],
	})
	@IsNotEmpty()
	items: PaginationUserRatingDTO<RatingDTO>

	@ApiProperty()
	@IsNotEmpty()
	pageSize: number

	@ApiProperty()
	cursor: string

	constructor(items: PaginationUserRatingDTO<RatingDTO>) {
		this.items = items
	}
}
