import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNotEmpty } from 'class-validator'

export class UpdateStatusRatingDTO {
	@ApiProperty({
		description: 'New status for the rating (Approved or Refused)',
		enum: ['Approved', 'Refused'],
	})
	@IsNotEmpty()
	@IsIn(['Approved', 'Refused'])
	newStatus: 'Approved' | 'Refused'
}
