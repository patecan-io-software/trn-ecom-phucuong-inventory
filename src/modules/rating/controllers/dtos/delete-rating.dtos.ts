import { ApiProperty } from '@nestjs/swagger'

export class DeleteRatingDTO {
	@ApiProperty({
		description:
			'Result code indicating the outcome of the delete operation',
		example: '00', // Example values based on your application's conventions
	})
	resultCode: string

	@ApiProperty({
		description:
			'Result message providing additional details about the outcome',
		example: 'Rating deleted successfully', // Example values based on your application's conventions
	})
	resultMessage: string

	constructor(data: Partial<DeleteRatingDTO>) {
		Object.assign(this, data)
	}
}
