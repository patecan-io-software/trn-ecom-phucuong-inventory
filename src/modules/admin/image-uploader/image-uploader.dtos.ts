import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNotEmpty } from 'class-validator'

export class UploadImageDTO {
	file: Express.Multer.File

	@ApiProperty({
		type: 'string',
		enum: ['brand', 'category', 'product'],
	})
	@IsNotEmpty()
	@IsIn(['brand', 'category', 'product'])
	image_type: string
}

export class MoveImageDTO {
	@ApiProperty()
	@IsNotEmpty()
	fileName: string

	@ApiProperty()
	@IsNotEmpty()
	destination: string
}
