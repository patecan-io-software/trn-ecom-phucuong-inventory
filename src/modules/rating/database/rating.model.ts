import mongoose, { Schema } from 'mongoose'

export const ratingSchema = new Schema(
	{
		product_id: {
			type: String,
		},
		rating: {
			type: Number,
		},
		comment: {
			type: String,
			maxLength: 200,
		},
		name: {
			type: String,
			maxLength: 50,
		},
		email: {
			type: String,
		},
		phone: {
			type: Number,
		},
		has_buy_product: {
			type: Boolean,
			default: true,
		},
		user_id: {
			type: String,
		},
		avartar_user: {
			type: String,
			default: 'https://via.placeholder.com/150',
		},
		status: {
			type: String,
			default: 'pending',
		},
	},
	{
		timestamps: true,
		colletion: 'Rating',
	},
)
export interface Rating {
	_id: string
	product_id: string
	rating: number
	comment: string
	name: string
	email?: string
	phone?: number
	has_buy_product?: boolean
	user_id?: string
	avartar_user?: string
	status: string
	createdAt?: Date
	updatedAt?: Date
}

export const RatingModel = mongoose.model('Rating', ratingSchema)
