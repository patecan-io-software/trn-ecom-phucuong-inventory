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

	async getAllListRating(product_id: string, page: number, size: number) {
		try {
			const skip = (page - 1) * size // Số bản ghi bỏ qua
			const ratings = await RatingModel.find({ product_id })
				.skip(skip)
				.limit(size) // Truy vấn theo productId và phân trang
			return ratings.map((rating) =>
				rating.toObject({ versionKey: false, flattenObjectIds: true }),
			)
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to retrieve ratings')
		}
	}

	async getTotalCount(product_id: string) {
		try {
			const totalCount = await RatingModel.countDocuments({ product_id }) // Đếm tổng số lượng đánh giá theo productId
			return totalCount
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to retrieve total count')
		}
	}
}
