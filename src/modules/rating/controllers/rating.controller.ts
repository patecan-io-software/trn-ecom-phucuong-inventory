import {
	BadRequestException,
	Body,
	Controller,
	Logger,
	Param,
	Post,
	Get,
	InternalServerErrorException,
} from '@nestjs/common'
import { RatingRepository } from '../database/rating.repository'
import {
	CreateRatingRequestDTO,
	CreateRatingResponseDTO,
} from './dtos/create-rating.dtos'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Rating } from '../database/rating.model'
import { ObjectIdParam } from '@modules/admin/product/controllers/dtos/common.dto'
import { RatingDTO } from './dtos/rating.dtos'

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

	@Get('ratings')
	@ApiResponse({
		status: 200,
		type: [RatingDTO],
	})
	async getListRating(): Promise<RatingDTO[]> {
		try {
			const ratings = await this.ratingRepo.getAllListRating()
			return ratings.map((rating) => new RatingDTO(rating))
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}
}
