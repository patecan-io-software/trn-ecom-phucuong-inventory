export interface Category {
	_id: string
	category_name: string
	category_description: string
	category_logoUrl: string
	category_images: {
		imageName: string
		imageUrl: string
	}[]
	category_isActive: boolean
	createdAt?: Date
	updatedAt?: Date
}
