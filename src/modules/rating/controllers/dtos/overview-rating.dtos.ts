import { ApiProperty } from '@nestjs/swagger'

export class OverviewRatingResponseDTO {
	@ApiProperty({
		description: 'The average rating for the product',
		example: 4.5,
		nullable: true,
	})
	averageRating: number | null

	@ApiProperty({
		description: 'The number ratings for the product',
		example: 10,
	})
	ratingCount: number

	@ApiProperty({
		description: 'The counts of ratings for rank (1 to 5)',
		example: [20, 15, 10, 5, 0],
	})
	ratingCountRank: number[]

	constructor(
		averageRating: number | null,
		ratingCount: number,
		ratingCountRank: number[],
	) {
		this.averageRating = averageRating
		this.ratingCount = ratingCount
		this.ratingCountRank = ratingCountRank
	}
}
