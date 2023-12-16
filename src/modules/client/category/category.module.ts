import { Module } from '@nestjs/common'
import { MongooseModule } from '@infras/mongoose'
import { CategoryRepository, categorySchema } from './database'
import { CategoryController } from './controllers/category.controller'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { CATEGORY_MODULE_CONFIG } from './constants'
import { ClientCategoryModuleConfig } from './interfaces'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Category',
				schema: categorySchema,
			},
		]),
		CacheModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				const config = configService.get(
					CATEGORY_MODULE_CONFIG,
				) as ClientCategoryModuleConfig
				return {
					ttl: config.cacheTTL,
				}
			},
			inject: [ConfigService],
		}),
	],
	providers: [CategoryRepository],
	controllers: [CategoryController],
})
export class CategoryModule {}
