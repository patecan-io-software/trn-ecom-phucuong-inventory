import {
	BadRequestException,
	Body,
	Controller,
	Logger,
	Post,
	Get,
	InternalServerErrorException,
	Query,
} from '@nestjs/common'
import { RatingRepository } from '../database/rating.repository'
import {
	CreateRatingRequestDTO,
	CreateRatingResponseDTO,
} from './dtos/create-rating.dtos'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Rating } from '../database/rating.model'
import { ObjectIdParam } from '@modules/admin/product/controllers/dtos/common.dto'
import { PaginationDTO, RatingDTO } from './dtos/rating.dtos'
import { retry } from 'rxjs'

@Controller('v1/ratings')
@ApiTags('Rating')
export class RatingController {
	private readonly logger: Logger = new Logger(RatingController.name)
	constructor(private readonly ratingRepo: RatingRepository) {}
	@Post('')
	@ApiResponse({
		status: 201,
		type: CreateRatingRequestDTO,
	})
	async create(
		@Body() dto: CreateRatingRequestDTO,
	): Promise<CreateRatingResponseDTO> {
		const ratingId = this.ratingRepo.genId()
		const rating: Rating = {
			...dto,
			_id: ratingId,
			status: 'Pending',
		}
		try {
			const result = await this.ratingRepo.createRating(rating)
			return new CreateRatingResponseDTO({ data: result })
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException()
		}
	}

	@Get('')
	@ApiResponse({
		status: 200,
		type: PaginationDTO, // Thay đổi kiểu trả về thành đối tượng phân trang
	})
	async getListRating(
		@Query('productId') product_id: string,
		@Query('page') page: number = 1, // Thêm tham số page mặc định là 1
		@Query('size') size: number = 10, // Thêm tham số size mặc định là 10
	): Promise<PaginationDTO<RatingDTO>> {
		try {
			const ratings = await this.ratingRepo.getAllListRating(
				product_id,
				page,
				size,
			) // Truyền vào productId, page, size
			const totalCount = await this.ratingRepo.getTotalCount(product_id) // Lấy tổng số lượng đánh giá

			const paginationData: PaginationDTO<RatingDTO> = {
				data: ratings.map((rating) => new RatingDTO(rating)), // Dữ liệu đánh giá
				page, // Số trang hiện tại
				size, // Kích thước trang
				totalCount, // Tổng số lượng đánh giá
			}

			return paginationData
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}
}
