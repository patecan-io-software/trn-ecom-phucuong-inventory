import { Module } from '@nestjs/common'
import { RatingController } from './controllers/rating.controller'
import { RatingRepository } from './database/rating.repository'
import { MongooseModule } from '@infras/mongoose'
import { ratingSchema } from './database/rating.model'
import { AdminRatingController } from './controllers/admin-rating.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { RatingScheduler } from './services/rating-scheduler.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import ratingConfig, { RATING_CONFIG } from 'src/config/rating.config'

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
			load: [ratingConfig],
		}),
	],
	controllers: [RatingController, AdminRatingController],
	providers: [
		RatingRepository,
		RatingScheduler,
		{
			provide: RATING_CONFIG,
			useFactory: (configService: ConfigService) =>
				configService.get(RATING_CONFIG),
			inject: [ConfigService],
		},
	],
	exports: [RATING_CONFIG],
})
export class RatingModule {}
