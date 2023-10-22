import { CategoryModel } from '@modules/admin/product/database'
import { ProductModel } from '@modules/admin/product/database/models/product.model'
import { Controller, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AddCategoryToProductsQueryDTO } from './dtos/add-category-to-products.dtos'

@Controller('/utility')
@ApiTags('Utility')
export class UtilityController {
	@Post('add-category-to-all-products')
	async addCategoryToAllProducts(@Query() q: AddCategoryToProductsQueryDTO) {
		const { categoryId, productId } = q
		const category = await CategoryModel.findOne({ _id: categoryId })
			.select('_id category_name category_logoUrl')
			.exec()
		if (productId) {
			await ProductModel.updateOne(
				{
					_id: productId,
				},
				{
					$addToSet: {
						product_categories: category.toObject(),
					},
				},
			).exec()
			return
		}
		await ProductModel.updateMany(
			{},
			{
				$addToSet: {
					product_categories: category.toObject(),
				},
			},
		).exec()

		return
	}
}
