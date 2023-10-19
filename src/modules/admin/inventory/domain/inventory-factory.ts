import { Product } from '@modules/admin/product'
import { Inventory } from './inventory'

export class InventoryFactory {
	createInventoriesForProduct(product: Product): Inventory[] {
		const { product_variants, _id: productId } = product.serialize()
		const inventoryList: Inventory[] = product_variants.map((variant) => ({
			inventory_location: '',
			inventory_parents: null,
			inventory_productId: productId,
			inventory_reservations: null,
			inventory_shopId: null,
			inventory_sku: variant.sku,
			inventory_stock: variant.quantity,
			inventory_price: variant.price,
			inventory_discount_price: variant.discount_price,
		}))
		return inventoryList
	}
}
