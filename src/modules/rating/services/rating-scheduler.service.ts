import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { RatingRepository } from '../database/rating.repository'

@Injectable()
export class RatingScheduler {
	private readonly logger = new Logger(RatingScheduler.name)

	constructor(private readonly ratingRepository: RatingRepository) {}

	@Cron('0 * * * *')
	async deleteExpiredRejectedRatings() {
		try {
			const expiredTime = new Date(Date.now() - 10 * 60 * 1000)
			const rejectedRatings =
				await this.ratingRepository.getRejectedRatings(expiredTime)

			if (rejectedRatings.length > 0) {
				const ratingIds = rejectedRatings.map((rating) =>
					rating._id.toString(),
				)
				await this.ratingRepository.batchDeleteRatings(ratingIds)
				this.logger.log(
					`Deleted ${rejectedRatings.length} expired rejected ratings.`,
				)
			}
		} catch (error) {
			this.logger.error(
				`Failed to delete expired rejected ratings: ${error.message}`,
			)
		}
	}
}
