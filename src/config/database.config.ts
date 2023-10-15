import mongoose from 'mongoose'
import { DATABASE_CONFIG } from './constants'
import { MongoDBOptions } from '@infras/mongoose'

export default () => ({
	[DATABASE_CONFIG]: {
		connectionString: process.env.DATABASE_CONNECTION_STRING,
		maxPoolSize: 50,
		debug: true,
	} as MongoDBOptions,
})
