import { Module } from '@nestjs/common'
import { RatingController } from './controllers/rating.controller'
import { RatingRepository } from './database/rating.repository'
import { MongooseModule } from '@infras/mongoose'
import { ratingSchema } from './database/rating.model'
import { AdminRatingController } from './controllers/admin-rating.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { RatingScheduler } from './services/rating-scheduler.service'
import { ConfigService } from '@nestjs/config'
import { RATING_MODULE_CONFIG } from './constants'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Rating',
				schema: ratingSchema,
			},
		]),
		ScheduleModule.forRoot(),
	],
	controllers: [RatingController, AdminRatingController],
	providers: [
		RatingRepository,
		RatingScheduler,
		{
			provide: RATING_MODULE_CONFIG,
			useFactory: (configService: ConfigService) =>
				configService.get(RATING_MODULE_CONFIG),
			inject: [ConfigService],
		},
	],
})
export class RatingModule {}
