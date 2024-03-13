import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNotEmpty, IsString } from 'class-validator'
import { RatingDTO } from './rating.dtos'

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
		type: RatingDTO,
	})
	@IsNotEmpty()
	updateRating: any

	constructor(updateRating: any) {
		this.updateRating = updateRating
	}
}
