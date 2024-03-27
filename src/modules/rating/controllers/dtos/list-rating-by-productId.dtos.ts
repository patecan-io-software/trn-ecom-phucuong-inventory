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

	@ApiProperty({
		description: 'Status for the rating (Approved or Pending)',
		enum: ['Approved', 'Pending'],
	})
	@IsIn(['Approved', 'Pending'])
	status: 'Approved' | 'Pending' | 'Refused'

	constructor(
		product_id: string,
		status: 'Approved' | 'Pending' | 'Refused',
	) {
		this.product_id = product_id
		this.status = status
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
