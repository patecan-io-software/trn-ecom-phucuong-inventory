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
		@Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc', // Default to descending order for newest to oldest
	): Promise<FilteredByStatusResponseDTO> {
		try {
			let ratings: Rating[]
			if (!cursor) {
				// If cursor is not provided, fetch the first page
				ratings = await this.ratingRepo.getByStatus(
					status,
					null, // Start from the beginning
					size,
					sortOrder,
				)
			} else {
				// If cursor is provided, fetch the next page using the cursor
				ratings = await this.ratingRepo.getByStatus(
					status,
					cursor,
					size + 1, // Fetch one extra rating to check if there are more ratings available
					sortOrder,
				)
			}
			let newCursor: string | null = null
			if (ratings.length > 0) {
				if (ratings.length > size) {
					newCursor = ratings[size]._id.toString() // Use the ID of the last rating in the current page
					ratings.splice(size) // Remove the last rating from the current page
				}
				const listRating: RatingDTO[] = ratings.map(
					(rating) => new RatingDTO(rating),
				)
				return new FilteredByStatusResponseDTO({
					listRating,
					cursor: newCursor,
					size,
				})
			} else {
				return new FilteredByStatusResponseDTO({
					listRating: [],
					cursor: cursor || null, // Return the provided cursor if exists, otherwise null
					size,
				})
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
