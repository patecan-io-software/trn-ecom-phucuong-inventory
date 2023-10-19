import { model, Schema } from 'mongoose'
import { INVENTORY_MODEL } from '../../constants'

export const inventorySchema = new Schema(
	{
		inventory_sku: { type: String },
		inventory_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
		inventory_location: { type: String, default: 'unknown' },
		inventory_stock: { type: Number, default: 0 },
		inventory_price: { type: Number, default: 0 },
		inventory_discount_price: { type: Number, default: 0 },
		inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
		inventory_reservations: [
			{ type: Schema.Types.ObjectId, ref: 'Product' },
		], // Đặt hàng nhưng chưa tới bước thanh toán
		inventory_parents: { type: Schema.Types.ObjectId, ref: 'Inventory' },
		inventory_isActive: { type: Boolean, default: true },
		isMarkedDelete: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		collection: 'Inventories',
	},
)

export const InventoryModel = model(INVENTORY_MODEL, inventorySchema)
