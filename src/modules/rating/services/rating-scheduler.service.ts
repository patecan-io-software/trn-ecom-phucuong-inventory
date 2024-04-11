import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { CronJob } from 'cron'
import { SchedulerRegistry } from '@nestjs/schedule'
import { RatingRepository } from '../database/rating.repository'
import { RATING_MODULE_CONFIG } from '../constants'
import { RatingModuleConfig } from '../interfaces'

@Injectable()
export class RatingScheduler implements OnModuleInit {
	private readonly logger = new Logger(RatingScheduler.name)

	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly schedulerRegistry: SchedulerRegistry,
		@Inject(RATING_MODULE_CONFIG)
		private readonly config: RatingModuleConfig,
	) {}

	onModuleInit() {
		if (!this.config.cronScheduleTime) {
			this.logger.error('cronSchedule is not defined in the config.')
			return
		}

		this.addCronJob(
			'deleteExpiredRejectedRatings',
			this.config.cronScheduleTime,
		)
	}

	private addCronJob(name: string, cronSchedule: string) {
		const job = new CronJob(cronSchedule, () => {
			this.logger.warn(
				`Job ${name} is running according to cron schedule!`,
			)
			this.deleteExpiredRejectedRatings()
		})

		this.schedulerRegistry.addCronJob(name, job)
		job.start()

		this.logger.warn(`Job ${name} added to run according to cron schedule!`)
	}

	private async deleteExpiredRejectedRatings() {
		try {
			const expiredTime = new Date(
				Date.now() -
					parseInt(this.config.ratingDurationInSecond) * 1000,
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
