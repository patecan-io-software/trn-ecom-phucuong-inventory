import { Injectable, Logger } from '@nestjs/common'
import { ProductModel } from './models/product.model'

@Injectable()
export class ProductRepository {
	private readonly logger = new Logger(ProductRepository.name)
	escapeRegExp(string: string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
	}
	async searchProductsByKeyword(keyword: string) {
		const escapedKeyword = this.escapeRegExp(keyword);
		const regexSearch: RegExp = new RegExp(escapedKeyword, 'i'); // 'i' for case-insensitive search

		try {
			const query: Record<string, any> = {
				$text: { $search: regexSearch.source },
			};

			const results = await ProductModel
				.find(query)
				.sort({ score: { $meta: 'textScore' } }) // Sort by text search score
				.lean()
				.exec();

			return results;
		} catch (error) {
			console.error('Error while searching by keyword:', error);
			throw error;
		}
	}
}
