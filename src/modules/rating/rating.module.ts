import { Module } from '@nestjs/common'
import { RatingController } from './controllers/rating.controller'
import { RatingRepository } from './database/rating.repository'
import { MongooseModule } from '@infras/mongoose'
import { ratingSchema } from './database/rating.model'
import { AdminRatingController } from './controllers/admin-rating.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { RatingScheduler } from './services/rating-scheduler.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import ratingConfig from 'src/config/rating.config'

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
		ConfigService,
		{
			provide: ratingConfig,
			useFactory: (configService: ConfigService) =>
				configService.get('ratingConfig'),
			inject: [ConfigService],
		},
	],
	exports: [ratingConfig],
})
export class RatingModule {}
