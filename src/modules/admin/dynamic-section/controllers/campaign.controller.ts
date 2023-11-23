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

import { AdminAuth } from '@modules/admin/auth'
import mongoose from 'mongoose'
import { CampaignNotFoundException } from '../errors/dynamic-section.errors'
import { Campaign, CampaignRepository } from '../database'
import {
	CampaignDTO,
	CreateCampaignRequestDTO,
	CreateCampaignResponseDTO,
} from './dto/campaign/campaign.dto'

@Controller('v1/admin/campaigns')
@ApiTags('Admin - Campaign')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('jwtToken')
export class CampaignController {
	private readonly logger: Logger = new Logger(CampaignController.name)

	constructor(private readonly campaignRepo: CampaignRepository) {}

	@Post()
	@ApiResponse({
		status: 201,
		type: CreateCampaignResponseDTO,
	})
	async create(
		@Body() dto: CreateCampaignRequestDTO,
	): Promise<CreateCampaignResponseDTO> {
		let campaign = await this.campaignRepo.getByName(dto.campaign_name)
		if (!campaign) {
			campaign = dto as any
		} else {
			// TODO: Temporarily allows to update campaign_content only
			campaign.campaign_content = dto.campaign_content
		}

		try {
			campaign = await this.campaignRepo.save(campaign)
			return new CreateCampaignResponseDTO({ data: campaign })
		} catch (error) {
			this.logger.error(error)
			throw error
		}
	}

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
