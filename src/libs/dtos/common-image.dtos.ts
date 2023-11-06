import { ApiProperty } from '@nestjs/swagger'

export class CommonImage {
	@ApiProperty()
	imageName: string

	@ApiProperty()
	imageUrl: string
}
