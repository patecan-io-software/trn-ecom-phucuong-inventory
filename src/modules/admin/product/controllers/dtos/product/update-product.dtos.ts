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
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	ValidateNested,
} from 'class-validator'

export class UpdateProductRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	product_name: string

	@ApiProperty()
	product_description: string

	@ApiProperty()
	@IsNotEmpty()
	product_banner_image: string

	@ApiProperty()
	@IsNotEmpty()
	product_brand: string

	@ApiProperty()
	@IsArray()
	@ArrayMinSize(1)
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
	@ValidateNested()
	product_variants: ProductVariantDTO[]

	@ApiProperty({
		required: true,
		default: true,
	})
	isPublished: boolean = true
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
