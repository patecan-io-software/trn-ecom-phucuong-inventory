import { ValidateMongoObjectId } from '@libs'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Validate } from 'class-validator'

export class ObjectIdParam {
	@ApiProperty()
	@Validate(ValidateMongoObjectId)
	@IsNotEmpty()
	id: string
}
