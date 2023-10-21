import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty } from 'class-validator'

export class ObjectIdParam {
	@ApiProperty()
	@IsMongoId()
	@IsNotEmpty()
	id: string
}
