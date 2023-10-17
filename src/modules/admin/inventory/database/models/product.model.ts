import mongoose, { Schema } from 'mongoose'
import { PRODUCT_MODEL } from '../../constants'

export const productSchema = new Schema(
	{
		product_code: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		product_name: {
			type: String,
			trim: true,
			maxLength: 150,
			required: true,
		},
		product_description: {
			type: String,
			required: true,
		},
		product_banner_image: {
			type: String,
			default: 'https://via.placeholder.com/350',
		},
		product_images: [
			{ type: String, default: 'https://via.placeholder.com/150' },
		],
		product_slug: String, // --> Quan-Jean-cao-cap
		product_price: {
			type: Number,
			required: true,
		},
		product_discountPrice: {
			type: Number,
			default: function () {
				return this.product_price
			},
		},
		product_discountPercentage: {
			type: Number,
			select: true,
			default: 0,
		},
		product_quantity: {
			type: Number,
			default: 0,
		},
		product_type: {
			type: String,
			required: true,
			enum: [
				'general',
				'bàn',
				'ghế',
				'tủ',
				'đèn',
				'gạch',
				'thiết bị vệ sinh',
				'others',
			],
		},
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
		product_material: {
			type: Array,
			default: [],
		},
		product_variations: {
			type: Array,
			default: [],
		},
		product_height: {
			type: String,
		},
		product_width: {
			type: String,
		},
		product_length: {
			type: String,
		},
		product_size_unit: {
			type: ['cm', 'm', 'mm', 'inch'],
		},
		product_weight: {
			value: { type: String },
			unit: ['kg', 'g', 'mg'],
		},
		product_attributes: { type: Schema.Types.Mixed, required: true },
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
productSchema.index({ product_code: 1 }, { unique: true })
productSchema.index({ status: 1 })

export const ProductModel = mongoose.model(PRODUCT_MODEL, productSchema)
