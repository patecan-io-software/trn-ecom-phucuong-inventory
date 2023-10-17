import { Injectable, Logger } from '@nestjs/common'
import { ProductModel } from './models/product.model'

@Injectable()
export class ProductRepository {
	private readonly logger = new Logger(ProductRepository.name)
	async searchProductsByKeyword(regexSearch: string) {
		try {
			const results = await ProductModel.find({
				isDraft: false,
				$text: {
					$search: regexSearch
				}
			}, {
				score: { $meta: 'textScore' }
			})
				.sort({
					score: { $meta: 'textScore' }
				})
				.lean();

			return results;
		} catch (error) {
			console.error('Lỗi khi tìm kiếm sản phẩm:', error);
			throw error;
		}
	}
}
