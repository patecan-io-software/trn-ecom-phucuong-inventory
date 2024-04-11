import { Module } from '@nestjs/common'
import { RatingController } from './controllers/rating.controller'
import { RatingRepository } from './database/rating.repository'
import { MongooseModule } from '@infras/mongoose'
import { ratingSchema } from './database/rating.model'
import { AdminRatingController } from './controllers/admin-rating.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { RatingScheduler } from './services/rating-scheduler.service'
import { ConfigModule } from '@nestjs/config'
import config from './config/rating.config'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Rating',
				schema: ratingSchema,
			},
		]),
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			load: [config],
		}),
	],
	controllers: [RatingController, AdminRatingController],
	providers: [RatingRepository, RatingScheduler],
})
export class RatingModule {}
