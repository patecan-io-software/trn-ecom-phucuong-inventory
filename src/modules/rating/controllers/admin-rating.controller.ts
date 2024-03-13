import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	NotFoundException,
	Param,
	Put,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { RatingRepository } from '../database/rating.repository'
import {
	UpdateStatusRatingDTO,
	UpdateStatusRatingResponseDTO,
} from './dtos/update-status-rating.dto'
import { Rating } from '../database/rating.model'
import { FilteredByStatusDTO } from './dtos/filtered-rating-by-status.dtos'

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
		type: FilteredByStatusDTO,
	})
	async getRatingsByStatus(
		@Param('status') status: string,
	): Promise<Rating[]> {
		try {
			const ratings = await this.ratingRepo.getByStatus(status)
			if (!ratings || ratings.length === 0) {
				throw new NotFoundException(
					'No ratings found for the given status',
				)
			}
			return ratings
		} catch (error) {
			throw error
		}
	}
}
