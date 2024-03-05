import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Post,
} from '@nestjs/common'
import { RatingRepository } from '../database/rating.repository'
import {
	CreateRatingRequestDTO,
	CreateRatingResponseDTO,
} from './dtos/create-rating.dtos'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Rating } from '../database/rating.model'
import { ObjectIdParam } from '@modules/admin/product/controllers/dtos/common.dto'
import { OverviewRatingResponseDTO } from './dtos/overview-rating.dtos'
import { error } from 'console'

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
}
