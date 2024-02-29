import { Module } from '@nestjs/common'
import { RatingController } from './controllers/rating.controller'
import { RatingRepository } from './database/rating.repository'
import { MongooseModule } from '@infras/mongoose'
import { ratingSchema } from './database/rating.model'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Rating',
				schema: ratingSchema,
			},
		]),
	],
	controllers: [RatingController],
	providers: [RatingRepository],
})
export class RatingModule {}
