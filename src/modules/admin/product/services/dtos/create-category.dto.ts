export interface CreateCategoryDTO {
	category_name: string
	category_description: string
	category_logoUrl: string
	category_images: {
		imageName: string
		imageUrl: string
	}[]
}
