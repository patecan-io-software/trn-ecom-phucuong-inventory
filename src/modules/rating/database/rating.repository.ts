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

	async getAllListRating(product_id: string, cursor: string, size: number) {
		try {
			const query = { product_id }
			if (cursor) {
				query['_id'] = { $gt: cursor } // Sử dụng $gt để lấy các bản ghi có _id lớn hơn cursor
			}
			const ratings = await RatingModel.find(query)
				.sort({ _id: 1 }) // Sắp xếp tăng dần theo _id
				.limit(size)
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
			const totalCount = await RatingModel.countDocuments({ product_id })
			return totalCount
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to retrieve total count')
		}
	}

	async overviewRating(productId: string): Promise<{
		averageRating: number | null
		ratingCount: number
		ratingCountRank: number[]
	}> {
		try {
			const rating = await RatingModel.find({
				product_id: productId,
				status: 'Approved',
			})

			if (rating.length === 0) {
				return {
					averageRating: 0,
					ratingCount: 0,
					ratingCountRank: [0, 0, 0, 0, 0],
				}
			}

			const totalRating = rating.reduce(
				(sum, rating) => sum + rating.rating,
				0,
			)
			const averageRating = totalRating / rating.length

			const ratingCount = rating.length

			const ratingCountRank = [0, 0, 0, 0, 0]
			rating.forEach((rating) => {
				ratingCountRank[rating.rating - 1]++
			})

			return { averageRating, ratingCount, ratingCountRank }
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to fetch and calculate overview rating')
		}
	}
}
