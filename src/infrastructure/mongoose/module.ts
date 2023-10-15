import {
	DynamicModule,
	Inject,
	Logger,
	Module,
	OnApplicationBootstrap,
} from '@nestjs/common'
import {
	DATABASE_CONNECTION,
	IS_GLOBAL,
	MONGODB_OPTION_PROVIDER,
} from './constants'
import {
	MongoDBModelOptions,
	MongoDBOptions,
	MongooseModuleForRootAsyncOptions,
} from './interfaces'
import mongoose, { Connection } from 'mongoose'

@Module({})
export class MongooseModule implements OnApplicationBootstrap {
	private readonly logger = new Logger(MongooseModule.name)

	constructor(@Inject(IS_GLOBAL) private readonly isGlobal: boolean) {}
	onApplicationBootstrap() {
		if (this.isGlobal) {
			this.logger.log('Connect to MongoDB successfully')
			return
		}
		this.logger.debug(
			'Load models successfully: ' +
				JSON.stringify(MongooseModule.modelList),
		)
	}

	private static modelList: string[] = []

	static forRootAsync(
		options: MongooseModuleForRootAsyncOptions,
	): DynamicModule {
		const { imports = [], useFactory, inject = [] } = options

		return {
			module: MongooseModule,
			global: true,
			imports: imports,
			providers: [
				{
					provide: IS_GLOBAL,
					useValue: true,
				},
				{
					provide: DATABASE_CONNECTION,
					useFactory: async (options: MongoDBOptions) => {
						const { connectionString, ...mongoDbOptions } = options
						const connection = await mongoose.connect(
							connectionString,
							mongoDbOptions,
						)
						return connection
					},
					inject: [MONGODB_OPTION_PROVIDER],
				},
				{
					provide: MONGODB_OPTION_PROVIDER,
					useFactory: useFactory,
					inject,
				},
			],
			exports: [DATABASE_CONNECTION],
		}
	}

	static forFeature(modelList: MongoDBModelOptions[]): DynamicModule {
		const providerList = modelList.map((schema) => ({
			provide: schema.name,
			useFactory: (connection: Connection) =>
				connection.model(schema.name, schema.schema),
			inject: [DATABASE_CONNECTION],
		}))
		const modelNameList = providerList.map((p) => p.provide)
		this.modelList.push(...modelNameList)
		return {
			module: MongooseModule,
			providers: [
				...providerList,
				{
					provide: IS_GLOBAL,
					useValue: false,
				},
			],
			exports: modelNameList,
		}
	}
}
