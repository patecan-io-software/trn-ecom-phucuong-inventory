export enum ProductStatus {
	Draft = 'Draft',
	Published = 'Published',
}

export interface ProductImage {
	imageName: string
	imageUrl: string
}

export interface ProductColor {
	label: string
	value: string
}

export interface ProductWeight {
	value: number
	unit: string
}

export enum ProductVariantStatus {
	Active = 'Active',
	Inactive = 'Inactive',
}

export enum ProductVariantType {
	None = 'None',
	ColorOnly = 'ColorOnly',
	MaterialOnly = 'MaterialOnly',
	ColorAndMaterial = 'ColorAndMaterial',
}
