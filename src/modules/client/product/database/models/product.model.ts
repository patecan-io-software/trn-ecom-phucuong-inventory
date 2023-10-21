import mongoose, { Schema } from 'mongoose'
import { PRODUCT_MODEL } from '../../constants'

export const productSchema = new Schema(
	{
		product_name: {
			type: String,
			trim: true,
			maxLength: 150,
			required: true,
			unique: true,
		},
		product_description: {
			type: String,
			required: true,
		},
		product_banner_image: {
			imageName: String,
			imageUrl: String,
		},
		product_slug: String, // --> Quan-Jean-cao-cap
		product_brand: {
			_id: { type: Schema.Types.ObjectId, ref: 'Brand' }, // Reference to the brand document
			brand_name: String, // Store the brand name denormalized
			brand_logoUrl: String, // Store the brand logo URL denormalized
		},
		product_categories: [
			{
				_id: { type: Schema.Types.ObjectId, ref: 'Category' }, // Reference to the brand document
				category_name: String, // Store the brand name denormalized
				category_logoUrl: String, // Store the brand logo URL denormalized
			},
		],
		product_height: {
			type: Number,
		},
		product_width: {
			type: Number,
		},
		product_length: {
			type: Number,
		},
		product_size_unit: {
			type: String,
			enum: ['cm', 'm', 'mm', 'inch'],
		},
		product_weight: {
			value: { type: Number },
			unit: {
				type: String,
				enum: ['kg', 'g'],
			},
		},
		product_variants: [
			{
				sku: String,
				color: {
					label: String,
					value: String,
				},
				material: String,
				price: Number,
				discount_price: Number,
				discount_percentage: Number,
				quantity: Number,
				image_list: [
					{
						imageName: String,
						imageUrl: String,
					},
				],
			},
		],
		product_isActive: { type: Boolean, default: true },
		isMarkedDelete: { type: Boolean, default: false },
		product_status: {
			type: String,
			index: true,
			select: true,
		},
	},
	{
		collection: 'Products',
		timestamps: true,
	},
)

productSchema.index({ product_name: 'text', product_description: 'text' })
productSchema.index({ product_status: 1 })

export const ProductModel = mongoose.model('Product', productSchema)
