import { ConnectOptions } from 'mongoose'

export interface MongoDBOptions extends ConnectOptions {
	connectionString: string
	debug?: boolean
}

export interface MongooseModuleForRootAsyncOptions {
	useFactory(...args: any[]): Promise<MongoDBOptions> | MongoDBOptions
	inject?: any[]
	imports?: any[]
}

export interface MongoDBModelOptions {
	name: string
	schema: any
	collection?: string
	options?: any
}

export interface MongoServerError {
	code: number
	keyPattern: string
	keyValue: Record<string, any>
	errorLabels: string[]
	message: string
}
