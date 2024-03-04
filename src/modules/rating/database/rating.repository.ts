import mongoose, { Model } from 'mongoose'
import { RatingModule } from '../rating.module'
import { Rating, RatingModel } from './rating.model'
import { Logger } from '@nestjs/common'

export class RatingRepository {
	[x: string]: any
	private logger: Logger = new Logger(RatingRepository.name)
	genId() {
		return new mongoose.Types.ObjectId().toHexString()
	}

	async createRating(rating: Rating) {
		const rat = new RatingModel({
			_id: rating._id
				? new mongoose.Types.ObjectId(rating._id)
				: new mongoose.Types.ObjectId(),
			...rating,
		})
		try {
			const result = await rat.save()

			return result.toObject({
				versionKey: false,
				flattenObjectIds: true,
			})
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to create rating')
		}
	}

	async getAllListRating() {
		try {
			const ratings = await RatingModel.find()
			return ratings.map((rating) =>
				rating.toObject({ versionKey: false, flattenObjectIds: true }),
			)
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to retrieve ratings')
		}
	}
}
