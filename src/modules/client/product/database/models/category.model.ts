import mongoose, { Schema, mongo } from 'mongoose'
import { CATEGORY_MODEL } from '../../../constants'

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
			maxLength: 150,
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

export const CategoryModel = mongoose.model("Category", categorySchema)
