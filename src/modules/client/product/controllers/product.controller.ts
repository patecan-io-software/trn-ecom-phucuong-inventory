import { Controller, Get, Param } from '@nestjs/common'
import { GetProductDetailResponseDTO } from './dtos/get-product-detail.dtos'
import { SearchProductsResponseDTO } from './dtos/search-products.dtos'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('v1/products')
@ApiTags('Client - Product')
export class ProductController {
	constructor() {}

	@Get()
	@ApiOkResponse({
		type: SearchProductsResponseDTO,
	})
	async searchProducts(): Promise<SearchProductsResponseDTO> {
		return {
			resultCode: '00',
			resultMessage: 'Success',
			items: [
				{
					_id: '65251627901c48887e58c5eb',
					product_name:
						'Dép Đi Trong Nhà Bằng EVA Chống Trượt Thời Trang Mùa Hè Cho Nam',
					product_description:
						'Chào mừng đến với cửa hàng của chúng tôi 😊😊😊 🌄 Chất lượng cao và giá cả thân thiện. 🌄',
					product_type: 'general',
					product_brand: {
						_id: '65251627901c48887e58c5eb',
						brand_name: 'TQ',
						brand_logoUrl:
							'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
					},
					product_banner_image:
						'https://giaydepsafa.com/wp-content/uploads/2019/01/home_banner_2.jpg',
					product_categories: [
						{
							_id: '65282829d3450417cc38e766',
							category_logoUrl:
								'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
							category_name: 'Đồ dùng',
						},
					],
					variant_color: 'red',
					variant_material: 'cotton',
					variant_price: 100000,
					product_slug: 'quan-jean-cao-cap',
					variant_image:
						'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
				},
				{
					_id: '65251627901c48887e58c5ec',
					product_name:
						'Dép Đi Trong Nhà Bằng EVA Chống Trượt Thời Trang Mùa Hè Cho Nam',
					product_description:
						'Chào mừng đến với cửa hàng của chúng tôi 😊😊😊 🌄 Chất lượng cao và giá cả thân thiện. 🌄',
					product_type: 'general',
					product_brand: {
						_id: '65251627901c48887e58c5eb',
						brand_name: 'TQ',
						brand_logoUrl:
							'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
					},
					product_banner_image:
						'https://giaydepsafa.com/wp-content/uploads/2019/01/home_banner_2.jpg',
					product_categories: [
						{
							_id: '65282829d3450417cc38e766',
							category_logoUrl:
								'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
							category_name: 'Đồ dùng',
						},
					],
					variant_color: 'red',
					variant_material: 'cotton',
					variant_price: 100000,
					product_slug: 'quan-jean-cao-cap',
					variant_image:
						'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
				},
			],
			page: 1,
			page_size: 10,
			total_count: 2,
		}
	}

	@Get('/:id')
	@ApiOkResponse({
		type: GetProductDetailResponseDTO,
	})
	async getProductDetail(
		@Param('id') productId: string,
	): Promise<GetProductDetailResponseDTO> {
		return {
			resultCode: '00',
			resultMessage: 'Success',

			_id: productId,
			product_name:
				'Dép Đi Trong Nhà Bằng EVA Chống Trượt Thời Trang Mùa Hè Cho Nam',
			product_description:
				'Chào mừng đến với cửa hàng của chúng tôi 😊😊😊 🌄 Chất lượng cao và giá cả thân thiện. 🌄',
			product_type: 'general',
			product_brand: {
				_id: '65251627901c48887e58c5eb',
				brand_name: 'TQ',
				brand_logoUrl:
					'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
			},
			product_categories: [
				{
					_id: '65282829d3450417cc38e766',
					category_logoUrl:
						'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
					category_name: 'Dép',
				},
			],
			product_materials: ['Sợi tổng hợp', 'Cao su', 'Da PU'],
			product_colors: ['red', 'green', 'blue'],
			product_banner_image:
				'https://giaydepsafa.com/wp-content/uploads/2019/01/home_banner_2.jpg',
			product_images: [
				'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
			],
			product_slug: 'quan-jean-cao-cap',
			product_variants: [
				{
					variant_sku: '1',
					variant_color: 'red',
					variant_material: 'Sylko',
					variant_price: 100000,
				},
				{
					variant_sku: '2',
					variant_color: 'green',
					variant_material: 'Cao su',
					variant_price: 200000,
				},
			],
			variant_price: 100000,
			variant_material: 'Sylko',
			variant_color: 'red',
			variant_image:
				'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
		}
	}
}
