import { ApiProperty } from '@nestjs/swagger'
import { RatingDTO } from './rating.dtos'
import { IsIn, IsNotEmpty } from 'class-validator'

export class PaginationListRatingByProductIdDTO<L> {
	@ApiProperty({ type: [RatingDTO], description: 'List of ratings' })
	@IsNotEmpty()
	listRating: L[]

	@ApiProperty({ description: 'Cursor for pagination' })
	cursor: string | null

	@ApiProperty({ description: 'Number of items in the list' })
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
		description: 'Response data',
		type: PaginationListRatingByProductIdDTO<RatingDTO>,
	})
	@IsNotEmpty()
	data: PaginationListRatingByProductIdDTO<RatingDTO>

	constructor(data: PaginationListRatingByProductIdDTO<RatingDTO>) {
		this.data = data
	}
}

export class PaginationUserRatingDTO {
	@ApiProperty({ type: [RatingDTO], description: 'List of ratings' })
	items: RatingDTO[]

	@ApiProperty({ description: 'Number of items in the list' })
	pageSize: number

	@ApiProperty({ description: 'Cursor for pagination', required: false })
	cursor?: string

	constructor(data: PaginationUserRatingDTO) {
		Object.assign(this, data)
	}
}

export class UserRatingResponseDTO {
	@ApiProperty({ type: [RatingDTO], description: 'List of ratings' })
	items: RatingDTO[]

	@ApiProperty({ description: 'Number of items in the list' })
	pageSize: number

	@ApiProperty({ description: 'Cursor for pagination', required: false })
	cursor?: string

	constructor(data: UserRatingResponseDTO) {
		Object.assign(this, data)
	}
}
