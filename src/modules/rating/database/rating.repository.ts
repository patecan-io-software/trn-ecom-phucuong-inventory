import mongoose from 'mongoose'
import { RatingModule } from '../rating.module'
import { Rating, RatingModel } from './rating.model'
import { Logger } from '@nestjs/common'

export class RatingRepository {
	private logger: Logger = new Logger(RatingRepository.name)
	genId() {
		return new mongoose.Types.ObjectId().toHexString()
	}

	onChanged(handle: any) {
		RatingModel.watch().on('change', (data) => {
			console.log(data)
		})
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
		}
	}
}
