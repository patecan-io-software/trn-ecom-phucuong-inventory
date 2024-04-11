import mongoose, { Model } from 'mongoose'
import { RatingModule } from '../rating.module'
import { Rating, RatingModel } from './rating.model'
import { Delete, Logger, Param } from '@nestjs/common'
import { FilteredByStatusResponseDTO } from '../controllers/dtos/filtered-rating-by-status.dtos'
import { RatingDTO } from '../controllers/dtos/rating.dtos'
import { retry } from 'rxjs'
import { Types } from 'mongoose'
import { ObjectId } from 'mongodb'
import { ApiResponse } from '@nestjs/swagger'
import { SortOrder } from 'mongoose'

export class RatingRepository {
	[x: string]: any
	private logger: Logger = new Logger(RatingRepository.name)
	genId() {
		return new mongoose.Types.ObjectId().toHexString()
	}

	constructor(private readonly ratingModel: Model<Rating>) {}

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

	async getByProductId(
		product_id: string,
		cursor: string | null,
		size: number,
		status: string,
		sortOrder: 'asc' | 'desc' = 'desc',
	): Promise<Rating[]> {
		try {
			const query: any = { product_id, status }

			if (cursor) {
				query['_id'] = { $gte: cursor }
			}

			const sortCriteria: Record<string, SortOrder> = {
				updatedAt: sortOrder === 'desc' ? -1 : 1,
			}

			const ratings = await RatingModel.find(query)
				.sort(sortCriteria)
				.limit(size + 1)

			return ratings.map((rating) => rating.toObject() as Rating)
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to retrieve ratings')
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

	async updateStatusRating(
		ratingId: string,
		newStatus: 'Approved' | 'Refused',
	): Promise<Rating> {
		try {
			const rating = await RatingModel.findById(ratingId)

			if (!rating) {
				throw new Error('Rating not found')
			}

			rating.status = newStatus
			await rating.save()

			return rating.toObject({
				versionKey: false,
				flattenObjectIds: true,
			})
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to update rating status')
		}
	}

	async getByStatus(
		status: string,
		cursor: string | null,
		size: number,
		sortOrder: 'asc' | 'desc' = 'desc',
	): Promise<Rating[]> {
		try {
			const query: any = { status }
			if (cursor) {
				query['_id'] = { $gte: cursor }
			}
			const sortCriteria: Record<string, SortOrder> = {
				createdAt: sortOrder === 'desc' ? -1 : 1,
			}
			const ratings = await RatingModel.find(query)
				.sort(sortCriteria)
				.limit(size + 1)
			return ratings.map((rating) => rating.toObject() as Rating)
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to retrieve ratings')
		}
	}
	async deleteRatingById(_id: string): Promise<string> {
		const rating = await RatingModel.findByIdAndDelete(_id).exec()
		if (!rating) {
			return null
		}

		return rating._id instanceof ObjectId
			? rating._id.toHexString()
			: String(rating._id)
	}

	async updateRating(
		ratingId: string,
		newRating: number,
		newComment: string,
	): Promise<Rating> {
		try {
			const rating = await RatingModel.findById(ratingId)

			if (!rating) {
				throw new Error('Rating not found')
			}

			rating.rating = newRating
			rating.comment = newComment || ''
			rating.status = 'Pending'
			await rating.save()

			return rating.toObject({
				versionKey: false,
				flattenObjectIds: true,
			})
		} catch (error) {
			this.logger.error(error)
			throw new Error('Failed to update rating status')
		}
	}

	async deleteUpdateRatingById(_id: string): Promise<string> {
		const rating = await RatingModel.findByIdAndDelete(_id).exec()
		if (!rating) {
			return null
		}

		return rating._id instanceof ObjectId
			? rating._id.toHexString()
			: String(rating._id)
	}
}
