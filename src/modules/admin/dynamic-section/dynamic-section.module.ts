import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CampaignController } from './controllers/campaign.controller'
import { CampaignRepository } from './database/campaign.repository'
import { PageTemplateRepository } from './database'
import { PageTemplateDefaultController } from './controllers/page-template-default.controller'
import { DYNAMIC_SECTION_MODULE_CONFIG } from './constants'
import { ClientPageTemplateDefaultController } from './controllers/client-page-template.controller'
import { CategoryEventHandler } from './event-handlers/category.event-handler'

@Module({
	providers: [
		CampaignRepository,
		PageTemplateRepository,
		{
			provide: DYNAMIC_SECTION_MODULE_CONFIG,
			useFactory: (configService: ConfigService) =>
				configService.get(DYNAMIC_SECTION_MODULE_CONFIG),
			inject: [ConfigService],
		},
		CategoryEventHandler,
	],
	controllers: [
		CampaignController,
		PageTemplateDefaultController,
		ClientPageTemplateDefaultController,
	],
})
export class DynamicSectionModule {}
