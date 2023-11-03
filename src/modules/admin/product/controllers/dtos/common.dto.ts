import { ValidateMongoObjectId } from '@libs'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'

export class ObjectIdParam {
	@ApiProperty()
	@Validate(ValidateMongoObjectId, {
		message: 'Invalid Params',
	})
	@IsNotEmpty()
	id: string
}
