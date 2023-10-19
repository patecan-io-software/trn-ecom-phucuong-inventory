import mongoose, { Schema } from 'mongoose'
import { MATERIAL_MODEL } from '../../constants'

export const materialSchema = new Schema(
	{
		material_name: {
			type: String,
			trim: true,
			maxLength: 150,
			required: true,
			unique: true,
		},
		isMarkedDelete: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		collection: 'Materials',
	},
)

export interface ProductMaterial {
	_id: string
	material_name: string
	createdAt?: Date
	updatedAt?: Date
}

// Create Index //
materialSchema.index({ material_name: 'text' })

export const ProductMaterialModel = mongoose.model(
	MATERIAL_MODEL,
	materialSchema,
)
