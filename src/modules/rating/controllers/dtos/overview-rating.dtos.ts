import { ApiProperty } from '@nestjs/swagger'

export class OverviewRatingResponseDTO {
	@ApiProperty({
		description: 'The average rating for the product',
		example: 4.5,
		nullable: true,
	})
	data: number | null

	constructor(data: number | null) {
		this.data = data
	}
}
