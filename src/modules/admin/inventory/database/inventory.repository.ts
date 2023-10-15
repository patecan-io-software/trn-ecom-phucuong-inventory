import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { Cat } from './models/inventory.model'
import { CAT_MODEL } from '../constants'

@Injectable()
export class InventoryRepository {
	constructor(
		@Inject(CAT_MODEL)
		private readonly catModel: Model<Cat>,
	) {}
}
