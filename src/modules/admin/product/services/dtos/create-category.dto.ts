export interface CreateCategoryDTO {
	category_name: string
	category_description: string
	parent_id: string
	category_logoUrl: string
	category_images: {
		imageName: string
		imageUrl: string
	}[]
}
