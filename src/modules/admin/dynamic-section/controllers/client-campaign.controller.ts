import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Logger,
	Param,
	Post,
	UseInterceptors,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { CampaignNotFoundException } from '../errors/dynamic-section.errors'
import { CampaignRepository } from '../database'
import { CampaignDTO } from './dto/campaign/campaign.dto'

@Controller('v1/campaigns')
@ApiTags('Client - Campaign')
@UseInterceptors(ClassSerializerInterceptor)
export class ClientCampaignController {
	constructor(private readonly campaignRepo: CampaignRepository) {}

	@Get('/:name')
	@ApiResponse({
		status: 200,
		type: CampaignDTO,
	})
	async getCampaignByName(
		@Param('name') campaignName: string,
	): Promise<CampaignDTO> {
		const campaign = await this.campaignRepo.getByName(campaignName)
		if (!campaign) {
			throw new CampaignNotFoundException(campaignName)
		}
		return new CampaignDTO(campaign)
	}
}
