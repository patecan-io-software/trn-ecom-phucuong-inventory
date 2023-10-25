import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	ProductDTO,
	ProductImage,
	ProductVariantDTO,
	ProductWeight,
} from './product.dtos'
import { Type } from 'class-transformer'
import { BrandDTO } from '../brand/brand.dtos'
import { SuccessResponseDTO } from '@libs'

export class UpdateProductRequestDTO {
	@ApiProperty()
	product_name: string

	@ApiProperty()
	product_description: string

	@ApiProperty({
		type: ProductImage,
	})
	@Type(() => ProductImage)
	product_banner_image: ProductImage

	@ApiProperty()
	product_brand: string

	@ApiProperty()
	product_categories: string[]

	@ApiProperty()
	product_height: number

	@ApiProperty()
	product_width: number

	@ApiProperty()
	product_length: number

	@ApiProperty()
	product_size_unit: string

	@ApiProperty()
	@Type(() => ProductWeight)
	product_weight: ProductWeight

	@ApiProperty({
		type: [ProductVariantDTO],
	})
	@Type(() => ProductVariantDTO)
	product_variants: ProductVariantDTO[]

	@ApiProperty({
		required: false,
		default: false,
	})
	isPublished: boolean = false
}

export class UpdateProductResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: ProductDTO,
	})
	@Type(() => ProductDTO)
	data: ProductDTO

	constructor(props: Partial<UpdateProductResponseDTO>) {
		super(props)
		Object.assign(this, props)
	}
}
