import mongoose from 'mongoose'
import { RatingModule } from '../rating.module'
import { Rating, RatingModel } from './rating.model'
import { Logger } from '@nestjs/common'

export class RatingRepository {
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

	async overviewRating(productId: string): Promise<number | null> {
		try {
			const rating = await RatingModel.find({
				product_id: productId,
				status: 'Approved',
			})

			if (rating.length === 0) {
				return null
			}

			const totalRating = rating.reduce(
				(sum, rating) => sum + rating.rating,
				0,
			)
			const averageRating = totalRating / rating.length

			return averageRating
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to fetch and calculate overview rating')
		}
	}
}
