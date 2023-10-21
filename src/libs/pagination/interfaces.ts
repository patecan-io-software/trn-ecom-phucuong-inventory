import { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export interface PaginationParams<T = any> {
	page: number
	page_size: number
	total_count: number
	items: T
}

export interface IPaginationResult<T = any> {
	readonly page: number
	readonly page_size: number
	readonly total_page: number
	readonly total_count: number
	readonly items: T[]
}

export const PaginationResult = (itemType: Type): Type<any> => {
	class PaginationResultClass implements IPaginationResult<Type> {
		@ApiProperty()
		readonly page: number

		@ApiProperty()
		readonly page_size: number

		@ApiProperty()
		readonly total_page: number

		@ApiProperty()
		readonly total_count: number

		@ApiProperty({
			type: [itemType],
		})
		readonly items: Type[]

		constructor(props: any) {
			Object.assign(this, props)
		}
	}

	return PaginationResultClass
}
