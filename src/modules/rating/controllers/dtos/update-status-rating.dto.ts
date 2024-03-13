import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNotEmpty, IsString } from 'class-validator'

export class UpdateStatusRatingDTO {
	@ApiProperty({
		description: 'New status for the rating (Approved or Refused)',
		enum: ['Approved', 'Refused'],
	})
	@IsNotEmpty()
	@IsIn(['Approved', 'Refused'])
	status: 'Approved' | 'Refused'
}

export class UpdateStatusRatingResponseDTO {
	@ApiProperty({
		description: 'Update rating',
		type: 'string',
	})
	@IsNotEmpty()
	updateRating: string

	constructor(updateRating: string) {
		this.updateRating = updateRating
	}
}
