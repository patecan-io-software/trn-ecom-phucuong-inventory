import { Inject, Injectable, Optional } from '@nestjs/common'
import { BaseRepository, DATABASE_CONNECTION } from '@infras/mongoose'
import { Connection } from 'mongoose'
import { IPaginationResult } from '@libs'
import { ProductModel } from '@modules/admin/product/database/models/product.model'
import { Product, ProductVariant } from '@modules/admin/product'
import { CartModel } from '@modules/client/cart/database/schema/cart.model'




@Injectable()
export class CartRepository extends BaseRepository {

	constructor(
		@Inject(DATABASE_CONNECTION)
			connection: Connection,
		@Optional()
			sessionId?: string,
	) {
		super(connection, sessionId)
	}

	protected clone(sessionId: string) {
		return new CartRepository(this.connection, sessionId)
	}




	async getProductById(id: string) {
		const product = await ProductModel.findById(id).exec()
		if (!product) {
			return null
		}
		const raw = product.toObject({
			versionKey: false,
			depopulate: true,
		})
		return new Product({
			...raw,
			product_variants: raw.product_variants.map(
				(variant) => new ProductVariant(variant as any),
			),
		} as any)
	}

	async getCartById(id: string) {
		const cart = await CartModel.findOne({_id: id, cart_state: 'active'}).lean().exec()
		if (!cart) {
			return null
		}
		const raw = cart.toObject({
			versionKey: false,
			depopulate: true,
		})
		return cart;
	}






}
