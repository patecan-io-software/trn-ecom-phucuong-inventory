import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNotEmpty } from 'class-validator'

export class FilteredByStatusDTO {
	@ApiProperty({
		description: 'Status for the rating (Approved, Pending, or Refused)',
		enum: ['Approved', 'Pending', 'Refused'],
	})
	@IsIn(['Approved', 'Pending', 'Refused'])
	status: 'Approved' | 'Pending' | 'Refused'

	constructor(status: 'Approved' | 'Pending' | 'Refused') {
		this.status = status
	}
}

export class FilteredByStatusResponseDTO {
	@ApiProperty({ type: [FilteredByStatusDTO] })
	items: FilteredByStatusDTO[]

	constructor(items: FilteredByStatusDTO[]) {
		this.items = items
	}
}
