import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	MinLength,
	ValidateIf,
	ValidateNested,
} from 'class-validator'
import { SIZE_UNIT } from '../../../constants'
import { SuccessResponseDTO } from '@libs'
import {
	ProductColor,
	ProductDTO,
	ProductImage,
	ProductWeight,
} from './product.dtos'

export class CreateProductVariantDTO {
	@ApiProperty()
	@IsNotEmpty()
	sku: string

	@ApiProperty({
		type: ProductColor,
	})
	@IsNotEmpty()
	@ValidateNested()
	color: ProductColor

	@ApiProperty()
	@IsNotEmpty()
	material: string

	@ApiProperty()
	@IsNotEmpty()
	@IsPositive()
	quantity: number

	@ApiProperty()
	@IsNotEmpty()
	@IsPositive()
	price: number

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	discount_price: number = 0

	@ApiProperty({
		type: [ProductImage],
	})
	@Type(() => ProductImage)
	@IsArray()
	@IsOptional()
	@MinLength(0)
	image_list: ProductImage[] = []
}

export class CreateProductRequestDTO {
	@ApiProperty()
	@IsNotEmpty()
	product_name: string

	@ApiProperty()
	@IsNotEmpty()
	product_description: string

	@ApiProperty()
	product_brand: string

	@ApiProperty()
	product_categories: string[]

	@ApiProperty()
	@Type(() => ProductWeight)
	product_weight: ProductWeight

	@ApiProperty()
	product_height: number

	@ApiProperty()
	product_width: number

	@ApiProperty()
	product_length: number

	@ApiProperty()
	@IsNotEmpty()
	@IsIn(SIZE_UNIT)
	product_size_unit: string

	@ApiProperty({
		type: ProductImage,
	})
	@Type(() => ProductImage)
	@ValidateNested()
	@IsNotEmpty()
	product_banner_image: ProductImage

	@ApiProperty({
		type: [CreateProductVariantDTO],
	})
	@Type(() => CreateProductVariantDTO)
	@ArrayMinSize(1)
	@ValidateIf((o) => o.product_variants.length > 1)
	product_variants: CreateProductVariantDTO[]

	@ApiProperty({
		required: false,
		default: false,
	})
	isPublished: boolean = false
}

export class CreateProductResponseDTO extends PartialType(SuccessResponseDTO) {
	@ApiProperty({
		type: ProductDTO,
	})
	@Type(() => ProductDTO)
	data: ProductDTO

	constructor(props: Partial<CreateProductResponseDTO>) {
		super(props)
		Object.assign(this, props)
	}
}
