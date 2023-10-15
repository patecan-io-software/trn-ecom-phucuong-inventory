import * as mongoose from 'mongoose'

export const CatSchema = new mongoose.Schema({
	name: String,
	age: Number,
	breed: String,
})

export interface Cat {
	name: string
	age: number
	breed: string
}
