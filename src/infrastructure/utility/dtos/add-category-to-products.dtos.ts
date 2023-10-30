import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class AddCategoryToProductsQueryDTO {
	@ApiProperty({
		required: true,
	})
	@IsNotEmpty()
	categoryId: string

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	productId: string
}
