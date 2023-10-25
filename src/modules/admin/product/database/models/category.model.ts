import mongoose, { Schema, mongo } from 'mongoose'
import { CATEGORY_MODEL } from '../../constants'

export const categorySchema = new Schema(
	{
		category_name: {
			type: String,
			trim: true,
			maxLength: 150,
			required: true,
		},
		category_description: {
			type: String,
			trim: true,
			maxLength: 500,
		},
		category_logoUrl: {
			type: String,
			trim: true,
			maxLength: 150,
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
	},
)
const textIndexOptions = {
	default_language: "none",
	textSearchDefaultOperator: "or",
	stopWords: ["and", "the", "in"]
};
categorySchema.index({ category_name: 'text', category_description: 'text' },
	textIndexOptions
)

export const CategoryModel = mongoose.model(CATEGORY_MODEL, categorySchema)
