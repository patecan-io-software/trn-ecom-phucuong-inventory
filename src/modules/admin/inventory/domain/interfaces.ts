export interface Inventory {
	_id: string
	inventory_sku: string
	inventory_productId: string
	inventory_location: string
	inventory_stock: number
	inventory_price: number
	inventory_discount_price: number
	inventory_shopId: string
	inventory_parents: string
}

export interface ProductVariant {
	sku: string
	quantity: number
	price: number
	discount_price: number
	discount_percentage: number
}
