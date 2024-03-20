import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Delete,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	HttpStatus,
} from '@nestjs/common'
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
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
import { get } from 'http'
import { ObjectIdParam } from '@modules/admin/product/controllers/dtos/common.dto'

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
	@Get('')
	@ApiResponse({
		status: 200,
		type: FilteredByStatusResponseDTO,
	})
	@ApiQuery({
		name: 'cursor',
		type: String,
		required: false,
	})
	async getRatingsByStatus(
		@Query('status') status: string,
		@Query('cursor') cursor?: string | null,
		@Query('size') size: number = 10,
	): Promise<FilteredByStatusResponseDTO> {
		try {
			let ratings: Rating[]

			if (cursor === '') {
				ratings = await this.ratingRepo.getByStatus(status, null, size)
			} else {
				ratings = await this.ratingRepo.getByStatus(
					status,
					cursor,
					size,
				)
			}

			let newCursor: string | null = null

			if (ratings.length > 0) {
				if (ratings.length > size) {
					newCursor = ratings[size]._id
					ratings.splice(size)
				}
				const listRating: RatingDTO[] = ratings.map(
					(rating) => new RatingDTO(rating),
				)
				const paginationData: PaginationFilteredByStatusDTO<RatingDTO> =
					{
						listRating,
						cursor: newCursor,
						size,
					}
				return new FilteredByStatusResponseDTO(paginationData)
			} else {
				const paginationData: PaginationFilteredByStatusDTO<RatingDTO> =
					{
						listRating: [],
						cursor: cursor !== null ? cursor : null,
						size,
					}
				return new FilteredByStatusResponseDTO(paginationData)
			}
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException(
				`Failed to filter with status ${status}`,
			)
		}
	}
	@Delete('/:id')
	@ApiResponse({
		status: 200,
	})
	async deleteRatingById(@Param('id') _id: string): Promise<void> {
		try {
			const deletedRatingId = await this.ratingRepo.deleteRatingById(_id)
			if (!deletedRatingId) {
				throw new Error('Rating not found')
			}
		} catch (error) {
			console.error('Error deleting rating:', error)
			throw new Error('Failed to delete rating')
		}
	}
}
