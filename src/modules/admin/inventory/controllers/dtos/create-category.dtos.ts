import { SuccessResponseDTO } from '@libs'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateCategoryRequestDTO {
	@ApiProperty()
	category_name: string

	@ApiProperty()
	category_description: string
	category_images: [
		{
			imageName: 'decor_1'
			imageUrl: 'https://nuwwaqzrwtilsxbajubq.supabase.co/storage/v1/object/public/images/homepage/decor.jpg'
		},
		{
			imageName: 'decor_2'
			imageUrl: 'https://nuwwaqzrwtilsxbajubq.supabase.co/storage/v1/object/public/images/homepage/bed-room.jpg'
		},
	]
	'category_products': [
		'652561ae81697be9bcbb1fc4',
		'652567bab4c7391d654f0ecb',
	]
}

export class CreateCategoryResponseDTO {}
