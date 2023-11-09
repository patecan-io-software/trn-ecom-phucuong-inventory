export interface Category {
	_id: string
	category_name: string
	category_logoUrl: string
}

export interface CategoryCreatedEvent {
	category: Category
}

export interface CategoryUpdatedEvent {
	category: Category
}

export interface CategoryDeletedEvent {
	category: Category
}
