import { Module } from '@nestjs/common'
import { RatingController } from './controllers/rating.controller'
import { RatingRepository } from './database/rating.repository'
import { MongooseModule } from '@infras/mongoose'
import { ratingSchema } from './database/rating.model'
import { AdminRatingController } from './controllers/admin-rating.controller'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Rating',
				schema: ratingSchema,
			},
		]),
	],
	controllers: [RatingController, AdminRatingController],
	providers: [RatingRepository],
})
export class RatingModule {}
