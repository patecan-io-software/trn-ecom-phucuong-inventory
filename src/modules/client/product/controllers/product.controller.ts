import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetProductDetailResponseDTO } from './dtos/get-product-detail.dtos'
import {
	SearchProductsQueryDTO,
	SearchProductsResponseDTO,
} from './dtos/search-products.dtos'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProductDTO } from '@modules/client/product/controllers/dtos/common.dtos'
import { InventoryService } from '@modules/admin/inventory/services'
import { ProductRepository } from '@modules/client/product/database'
import {
	FindCategoriesQueryDTO,
	FindCategoriesResponseDTO,
} from '@modules/admin/inventory/controllers/dtos/find-categories.dtos'
import {
	FindProductsQueryDTO,
	FindProductsResponseDTO,
} from '@modules/client/product/controllers/dtos/find-products-query.dtos'
import { CategoryDTO, ObjectIdParam } from '@modules/admin/inventory/controllers/dtos/common.dto'

@Controller('v1/products')
@ApiTags('Client - Product')
export class ProductController {
	constructor(private readonly productRepo: ProductRepository) {

	}

	@Get('/search/:keyword')
	@ApiResponse({
		status: 201,
		type: ProductDTO,
	})
	async searchProductsByKeyword(@Param('keyword') keyword: string): Promise<SearchProductsResponseDTO> {
		const products = await this.productRepo.searchProductsByKeyword(keyword)
		return new SearchProductsResponseDTO(products)
	}

	@Get()
	@ApiResponse({
		status: 201,
		type: FindProductsResponseDTO,
	})
	async findProducts(
		@Query() query: FindProductsQueryDTO,
	): Promise<FindProductsResponseDTO> {
		const result = await this.productRepo.find(query)
		return new FindProductsResponseDTO(result)
	}

	@Get('/:id')
	@ApiResponse({
		status: 201,
		type: ProductDTO,
	})
	async getById(@Param() { id }: ObjectIdParam): Promise<ProductDTO> {
		const product = await this.productRepo.getById(id)
		return new ProductDTO(product)
	}



	@Get()
	@ApiOkResponse({
		type: SearchProductsResponseDTO,
	})
	async searchProducts(
		@Query() q: SearchProductsQueryDTO,
	): Promise<SearchProductsResponseDTO> {
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
					product_slug: 'quan-jean-cao-cap',
					sku: 'SKU01',
					price: 100000,
					discountPercentage: 50,
					discountPrice: 50000,
					quantity: 15,
					image: {
						imageName: 'image_01',
						imageUrl:
							'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
					},
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
					product_slug: 'quan-jean-cao-cap',
					sku: 'SKU02',
					price: 9000,
					discountPercentage: 10,
					discountPrice: 8100,
					quantity: 10,
					image: {
						imageName: 'image_01',
						imageUrl:
							'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
					},
				},
			],
			page: 1,
			page_size: 10,
			total_count: 2,
		}
	}

	@Get('/:slug')
	@ApiOkResponse({
		type: GetProductDetailResponseDTO,
	})
	async getProductDetail(
		@Param('slug') slug: string,
	): Promise<GetProductDetailResponseDTO> {
		return {
			resultCode: '00',
			resultMessage: 'Success',
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
			product_categories: [
				{
					_id: '65282829d3450417cc38e766',
					category_logoUrl:
						'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
					category_name: 'Dép',
				},
			],
			product_materials: ['Sợi tổng hợp', 'Cao su', 'Da PU'],
			product_colors: [
				{
					value: '#ff0000',
					label: 'Đỏ',
				},
				{
					value: '#0000ff',
					label: 'Xanh nước biển',
				},
			],
			product_banner_image:
				'https://giaydepsafa.com/wp-content/uploads/2019/01/home_banner_2.jpg',
			product_images: [
				'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
			],
			product_slug: slug,
			product_variants: [
				{
					sku: 'SKU01',
					color: {
						value: '#ff0000',
						label: 'Đỏ',
					},
					material: 'Sylko',
					price: 100000,
					discountPercentage: 10,
					discountPrice: 90000,
					quantity: 15,
					image_list: [
						{
							imageName: 'image_01',
							imageUrl:
								'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
						},
						{
							imageName: 'image_02',
							imageUrl:
								'https://concung.com/2023/05/62771-101619-large_mobile/dep-suc-be-trai-animo-a2303-jk004-21-mau-be.jpg',
						},
					],
				},
				{
					sku: 'SKU02',
					color: {
						value: '#00ff00',
						label: 'Xanh lá cây',
					},
					material: 'Cao su',
					price: 200000,
					discountPercentage: 20,
					discountPrice: 180000,
					quantity: 15,
					image_list: [
						{
							imageName: 'image_03',
							imageUrl:
								'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
						},
						{
							imageName: 'image_04',
							imageUrl:
								'https://concung.com/2023/05/62771-101619-large_mobile/dep-suc-be-trai-animo-a2303-jk004-21-mau-be.jpg',
						},
					],
				},
			],
			sku: 'SKU01',
			price: 100000,
			discountPercentage: 10,
			discountPrice: 90000,
			quantity: 15,
			image: {
				imageName: 'image_01',
				imageUrl:
					'https://bizweb.dktcdn.net/thumb/large/100/400/362/products/z4077245243050-74d1fa2866141d19cd2aa599ca002724.jpg?v=1682920939550',
			},
		}
	}
}

