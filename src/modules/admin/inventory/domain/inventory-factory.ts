import { Product } from '@modules/admin/product'
import { Inventory, ProductVariant } from './interfaces'

export class InventoryFactory {
	createInventoriesForProduct(product: Product): Inventory[] {
		const { product_variants, _id: productId } = product.serialize()
		const inventoryList: Inventory[] = product_variants.map((variant) => ({
			_id: undefined,
			inventory_location: '',
			inventory_parents: null,
			inventory_productId: productId,
			inventory_shopId: null,
			inventory_sku: variant.sku,
			inventory_stock: variant.quantity,
			inventory_price: variant.price,
			inventory_discount_price: variant.discount_price,
		}))
		return inventoryList
	}

	createInventoryForProductVariant(
		productId: string,
		variant: ProductVariant,
	): Inventory {
		return {
			_id: undefined,
			inventory_location: '',
			inventory_parents: null,
			inventory_productId: productId,
			inventory_shopId: null,
			inventory_sku: variant.sku,
			inventory_stock: variant.quantity,
			inventory_price: variant.price,
			inventory_discount_price: variant.discount_price,
		}
	}
}
