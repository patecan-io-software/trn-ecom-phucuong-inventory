import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	Post,
	InternalServerErrorException,
	Query,
	Param,
	Put,
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
import { OverviewRatingResponseDTO } from './dtos/overview-rating.dtos'
import { error } from 'console'
import {
	UpdateStatusRatingDTO,
	UpdateStatusRatingResponseDTO,
} from './dtos/update-status-rating.dto'

@Controller('v1')
@ApiTags('Rating')
export class RatingController {
	private readonly logger: Logger = new Logger(RatingController.name)
	constructor(private readonly ratingRepo: RatingRepository) {}
	@Post('/ratings')
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

	@Get('/ratings')
	@ApiResponse({
		status: 200,
		type: PaginationDTO,
	})
	async getListRating(
		@Query('productId') product_id: string,
		@Query('cursor') cursor: string,
		@Query('size') size: number = 10,
	): Promise<PaginationDTO<RatingDTO>> {
		try {
			const ratings = await this.ratingRepo.getAllListRating(
				product_id,
				cursor,
				size,
			)
			const totalCount = await this.ratingRepo.getTotalCount(product_id)

			const paginationData: PaginationDTO<RatingDTO> = {
				data: ratings.map((rating) => new RatingDTO(rating)),
				cursor,
				size,
				totalCount,
			}

			return paginationData
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	@Get('/ratings/overview/:productId')
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

	@Put('/admin/ratings/:ratingId')
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
}
