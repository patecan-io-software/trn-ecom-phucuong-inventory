import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Delete,
	Logger,
	Post,
	InternalServerErrorException,
	Query,
	Param,
	NotFoundException,
	Put,
	Req,
} from '@nestjs/common'
import { RatingRepository } from '../database/rating.repository'
import {
	CreateRatingRequestDTO,
	CreateRatingResponseDTO,
} from './dtos/create-rating.dtos'
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Rating } from '../database/rating.model'
import { ObjectIdParam } from '@modules/admin/product/controllers/dtos/common.dto'
import { RatingDTO } from './dtos/rating.dtos'
import { retry } from 'rxjs'
import { OverviewRatingResponseDTO } from './dtos/overview-rating.dtos'
import { error } from 'console'
import {
	FilteredByStatusResponseDTO,
	PaginationFilteredByStatusDTO,
} from './dtos/filtered-rating-by-status.dtos'
import {
	UpdateRatingDTO,
	UpdateRatingResponseDTO,
	UpdateStatusRatingDTO,
	UpdateStatusRatingResponseDTO,
} from './dtos/update-status-rating.dto'
import {
	ListRatingByProductIdResponseDTO,
	PaginationListRatingByProductIdDTO,
	PaginationUserRatingDTO,
	UserRatingResponseDTO,
} from './dtos/list-rating-by-productId.dtos'
import { AdminAuth } from '@modules/admin/auth'

@Controller('v1/ratings')
@ApiTags('Rating')
export class RatingController {
	[x: string]: any
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
		type: ListRatingByProductIdResponseDTO,
	})
	@ApiQuery({
		name: 'cursor',
		type: String,
		required: false,
	})
	async getRatingsByProductId(
		@Query('productId') product_id: string,
		@Query('cursor') cursor?: string | null,
		@Query('size') size: number = 10,
	): Promise<ListRatingByProductIdResponseDTO> {
		try {
			const status: string = 'Approved'

			let ratings: Rating[]

			if (cursor === '') {
				ratings = await this.ratingRepo.getByProductId(
					product_id,
					null,
					size,
					status,
				)
			} else {
				ratings = await this.ratingRepo.getByProductId(
					product_id,
					cursor,
					size,
					status,
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
				const paginationData: PaginationListRatingByProductIdDTO<RatingDTO> =
					{
						listRating,
						cursor: newCursor,
						size,
					}
				return new ListRatingByProductIdResponseDTO(paginationData)
			} else {
				const paginationData: PaginationFilteredByStatusDTO<RatingDTO> =
					{
						listRating: [],
						cursor: cursor !== null ? cursor : null,
						size,
					}
				return new ListRatingByProductIdResponseDTO(paginationData)
			}
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	@Get('/overview/:productId')
	@ApiResponse({
		status: 200,
		type: OverviewRatingResponseDTO,
	})
	async overview(
		@Param('productId') productId: string,
	): Promise<OverviewRatingResponseDTO> {
		try {
			const { averageRating, ratingCount, ratingCountRank } =
				await this.ratingRepo.overviewRating(productId)

			if (averageRating !== null) {
				const roundedAverage = parseFloat(averageRating.toFixed(1))
				return new OverviewRatingResponseDTO(
					roundedAverage,
					ratingCount,
					ratingCountRank,
				)
			} else {
				console.log(
					'No Approved Ratings found for Product ${productId}',
				)
				return new OverviewRatingResponseDTO(
					averageRating,
					ratingCount,
					ratingCountRank,
				)
			}
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException()
		}
	}

	@Put('/:ratingId')
	@ApiResponse({
		status: 200,
		description: 'Update rating successfully',
		type: UpdateRatingResponseDTO,
	})
	async updateStatusRating(
		@Param('ratingId') ratingId: string,
		@Body() dto: UpdateRatingDTO,
	): Promise<UpdateRatingResponseDTO> {
		try {
			const updateRating = await this.ratingRepo.updateRating(
				ratingId,
				dto.newRating,
				dto.newComment || '',
			)
			return new UpdateRatingResponseDTO(updateRating)
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException('Failed to update rating')
		}
	}

	@Delete('/:id')
	@ApiResponse({
		status: 200,
	})
	async deleteUpdateRatingById(@Param('id') _id: string): Promise<void> {
		try {
			const deletedRatingId =
				await this.ratingRepo.deleteUpdateRatingById(_id)
			if (!deletedRatingId) {
				throw new Error('Rating not found')
			}
		} catch (error) {
			console.error('Error deleting rating:', error)
			throw new Error('Failed to delete rating')
		}
	}

	@Get('/me')
	@AdminAuth('jwtToken')
	@ApiResponse({
		status: 200,
		type: UserRatingResponseDTO,
	})
	@ApiQuery({
		name: 'cursor',
		type: String,
		required: false,
	})
	async getUserRatings(
		@Query('productId') product_id: string,
		@Query('cursor') cursor?: string | null,
		@Query('pageSize') pageSize: number = 10,
	): Promise<UserRatingResponseDTO> {
		try {
			let ratings: Rating[]

			if (cursor === '') {
				ratings = await this.ratingRepo.getUserRatings(
					product_id,
					null,
					pageSize,
				)
			} else {
				ratings = await this.ratingRepo.getUserRatings(
					product_id,
					cursor,
					pageSize,
				)
			}

			let newCursor: string | null = null
			const listMyRating: RatingDTO[] = ratings.map(
				(rating) => new RatingDTO(rating),
			)

			if (ratings.length > 0) {
				if (ratings.length > pageSize) {
					newCursor = ratings[pageSize]._id
					ratings.splice(pageSize)
				}
				const paginationData: PaginationUserRatingDTO<RatingDTO> = {
					listMyRating,
					pageSize,
					cursor: newCursor,
				}
				return new UserRatingResponseDTO(paginationData)
			} else {
				const paginationData: PaginationUserRatingDTO<RatingDTO> = {
					listMyRating: [],
					cursor: cursor !== null ? cursor : null,
					pageSize,
				}
				return new UserRatingResponseDTO(paginationData)
			}
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}
}
