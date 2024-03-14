import {
	BadRequestException,
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	Param,
	Put,
	Query,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { RatingRepository } from '../database/rating.repository'
import {
	UpdateStatusRatingDTO,
	UpdateStatusRatingResponseDTO,
} from './dtos/update-status-rating.dto'
import { Rating } from '../database/rating.model'
import {
	FilteredByStatusResponseDTO,
	PaginationFilteredByStatusDTO,
} from './dtos/filtered-rating-by-status.dtos'
import { RatingDTO } from './dtos/rating.dtos'

@Controller('v1/admin/ratings')
@ApiTags('Admin - Rating')
export class AdminRatingController {
	private readonly logger: Logger = new Logger(AdminRatingController.name)
	constructor(private readonly ratingRepo: RatingRepository) {}
	@Put('/:ratingId')
	@ApiResponse({
		status: 200,
		description: 'Update rating status successfully',
		type: UpdateStatusRatingResponseDTO,
	})
	async updateStatusRating(
		@Param('ratingId') ratingId: string,
		@Body() dto: UpdateStatusRatingDTO,
	): Promise<UpdateStatusRatingResponseDTO> {
		try {
			const updateRating = await this.ratingRepo.updateStatusRating(
				ratingId,
				dto.status,
			)
			return new UpdateStatusRatingResponseDTO(updateRating)
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException('Failed to update rating status')
		}
	}

	@Get('/status/:status')
	@ApiResponse({
		status: 200,
		type: FilteredByStatusResponseDTO,
	})
	async getRatingsByStatus(
		@Param('status') status: string,
		@Query('cursor') cursor: string,
		@Query('size') size: number = 10,
	): Promise<{
		paginationData: PaginationFilteredByStatusDTO<RatingDTO>
	}> {
		try {
			const ratings = await this.ratingRepo.getByStatus(
				status,
				cursor,
				size,
			)

			let newCursor: string | null = null

			if (ratings.length > 0) {
				// Kiểm tra xem cursor đã được sử dụng hay chưa
				if (!cursor || ratings.length === size) {
					newCursor = ratings[ratings.length - 1]._id
				}
				const listRating: RatingDTO[] = ratings.map(
					(rating) => new RatingDTO(rating),
				)
				return {
					paginationData: {
						listRating,
						cursor: newCursor,
						size,
					},
				}
			} else {
				return {
					paginationData: {
						listRating: [],
						cursor: null,
						size,
					},
				}
			}
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException(
				`Failed to filter with status ${status}`,
			)
		}
	}
}
