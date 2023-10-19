import { ApiProperty } from '@nestjs/swagger'

export class ProductMaterialDTO {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string
}
