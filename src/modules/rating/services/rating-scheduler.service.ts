import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { RatingRepository } from '../database/rating.repository'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RatingScheduler {
	private readonly logger = new Logger(RatingScheduler.name)
	private cronSchedule: string | undefined

	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly configService: ConfigService, // Inject ConfigService
	) {
		this.cronSchedule = this.configService.get('CRON_SCHEDULE')
	}

	// Define a separate method to handle dynamic scheduling
	scheduleCronJob() {
		if (this.cronSchedule) {
			this.deleteExpiredRejectedRatings() // Call the method directly
		} else {
			this.logger.error('Cron schedule is not defined.')
		}
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async deleteExpiredRejectedRatings() {
		try {
			if (!this.cronSchedule) {
				this.cronSchedule =
					this.configService.get('CRON_SCHEDULE') ||
					CronExpression.EVERY_MINUTE
			}

			const expiredTime = new Date(
				Date.now() -
					parseInt(this.configService.get('EXPIRED_TIME') || '0') *
						1000,
			)
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
