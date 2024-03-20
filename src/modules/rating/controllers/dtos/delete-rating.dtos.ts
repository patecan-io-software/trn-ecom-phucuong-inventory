import { ApiProperty } from '@nestjs/swagger'

export class DeleteRatingResponseDTO {
	@ApiProperty({
		description: 'ID of the deleted rating',
	})
	deletedRatingId: string

	@ApiProperty({
		description: 'Message indicating the success of the deletion',
	})
	message: string

	constructor(deletedRatingId: string, message: string) {
		this.deletedRatingId = deletedRatingId
		this.message = message
	}
}
