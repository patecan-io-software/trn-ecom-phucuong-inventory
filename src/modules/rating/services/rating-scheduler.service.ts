import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { CronJob } from 'cron'
import { SchedulerRegistry } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { RatingRepository } from '../database/rating.repository'
import { RatingConfig } from 'src/config/rating.config'

@Injectable()
export class RatingScheduler implements OnModuleInit {
	private readonly logger = new Logger(RatingScheduler.name)
	private readonly cronSchedule: string

	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly configService: ConfigService<RatingConfig>,
	) {
		this.cronSchedule = this.configService.get<string>('cronSchedule')
	}

	onModuleInit() {
		if (!this.cronSchedule) {
			this.logger.error('cronSchedule is not defined in the config.')
			return
		}

		this.addCronJob('deleteExpiredRejectedRatings', this.cronSchedule)
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
					parseInt(this.configService.get<string>('expiredTime')) *
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
