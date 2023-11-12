import mongoose, { Schema } from 'mongoose'
import { CATEGORY_MODEL } from '../../constants'

export const categorySchema = new Schema(
	{
		parent_id: {
			type: Schema.Types.ObjectId,
			required: false,
		},
		category_name: {
			type: String,
			trim: true,
			maxLength: 150,
			required: true,
			unique: true,
		},
		category_description: {
			type: String,
			trim: true,
			maxLength: 500,
		},
		category_logoUrl: {
			type: String,
			trim: true,
			default: 'https://via.placeholder.com/150',
		},
		category_images: [
			{
				imageName: { type: String },
				imageUrl: { type: String },
			},
		],
		category_isActive: { type: Boolean, default: true },
		isMarkedDelete: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		collection: 'Categories',
		toObject: { virtuals: true },
	},
)
const textIndexOptions = {
	default_language: 'none',
	wildcard: 'text',
	textSearchDefaultOperator: 'or',
	minWordLength: 1,
}
categorySchema.index(
	{ category_name: 'text', category_description: 'text' },
	textIndexOptions,
)

categorySchema.virtual('is_parent').get(function (this: any) {
	return !this.parent_category
})

categorySchema.virtual('parent_category', {
	ref: CATEGORY_MODEL,
	localField: 'parent_id',
	foreignField: '_id',
	justOne: true,
})

categorySchema.virtual('child_category_count', {
	ref: CATEGORY_MODEL,
	localField: '_id',
	foreignField: 'parent_id',
	count: true,
})

export interface Category {
	_id: string
	category_name: string
	category_description: string
	category_logoUrl: string
	parent_id: string
	category_images: {
		imageName: string
		imageUrl: string
	}[]
	category_isActive: boolean
	createdAt?: Date
	updatedAt?: Date

	// populate
	parent_category?: Category
	is_parent?: boolean
	child_category_count?: number
}

export const CategoryModel = mongoose.model(CATEGORY_MODEL, categorySchema)
