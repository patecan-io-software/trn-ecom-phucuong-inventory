import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Inject,
	Logger,
	Param,
	Post,
	UseInterceptors,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AdminAuth } from '@modules/admin/auth'
import { ImageUploader } from '@modules/admin/image-uploader'
import { CampaignNotFoundException } from '../errors/dynamic-section.errors'
import { CampaignRepository } from '../database'
import {
	CampaignDTO,
	CreateCampaignRequestDTO,
	CreateCampaignResponseDTO,
} from './dto/campaign/campaign.dto'
import { DynamicSectionModuleConfig } from '../interfaces'
import { DYNAMIC_SECTION_MODULE_CONFIG } from '../constants'
import { isURL } from 'class-validator'
import { randomInt } from 'crypto'

@Controller('v1/admin/campaigns')
@ApiTags('Admin - Campaign')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('jwtToken')
export class CampaignController {
	private readonly logger: Logger = new Logger(CampaignController.name)

	constructor(
		private readonly campaignRepo: CampaignRepository,
		private readonly imageUploader: ImageUploader,
		@Inject(DYNAMIC_SECTION_MODULE_CONFIG)
		private readonly config: DynamicSectionModuleConfig,
	) {}

	@Post()
	@ApiResponse({
		status: 201,
		type: CreateCampaignResponseDTO,
	})
	async create(
		@Body() dto: CreateCampaignRequestDTO,
	): Promise<CreateCampaignResponseDTO> {
		const { campaignImageStoragePath } = this.config
		// upload images of campaign
		const now = Date.now()
		await Promise.all(
			dto.campaign_images.map(async (image, index) => {
				image.imageName = `image_${index + 1}`
				// if image is url, skip because it is already uploaded
				if (isURL(image.imageUrl)) {
					return
				}
				const newImageUrl = await this.imageUploader.copyFromTempTo(
					image.imageUrl,
					`${campaignImageStoragePath}/${dto.campaign_name}/${image.imageName}_${now}`,
					false,
				)
				image.imageUrl = newImageUrl
			}),
		)

		let campaign = await this.campaignRepo.getByName(dto.campaign_name)
		if (!campaign) {
			campaign = dto as any
		} else {
			// TODO: Temporarily allows to update campaign_content only
			campaign.campaign_content = dto.campaign_content
			campaign.campaign_images = dto.campaign_images
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
