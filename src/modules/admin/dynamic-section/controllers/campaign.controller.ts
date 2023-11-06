import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Inject,
	Logger,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SuccessResponseDTO } from '@libs'

import { AdminAuth } from '@modules/admin/auth'
import mongoose from 'mongoose'
import { CampaignRepository } from '@modules/admin/dynamic-section/database/campaign.repository'
import { Campaign } from '@modules/admin/dynamic-section/database/schemas/campaign.model'

@Controller('v1/admin/campaigns')
@ApiTags('Admin - Campaign')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('apiKey')
export class CampaignController {
	private readonly logger: Logger = new Logger(CampaignController.name)

	constructor(
		private readonly campaignRepo: CampaignRepository,
	) {

	}

	// @Post()
	// @ApiResponse({
	// 	status: 201,
	// 	type: CreateCampaignResponseDTO,
	// })
	// async create(
	// 	@Body() dto: CreateCampaignResponseDTO,
	// ): Promise<CreateCampaignResponseDTO> {
	// 	let campaign: Campaign = {
	// 		_id: new mongoose.Types.ObjectId().toHexString(),
	// 		...dto,
	// 	}
	// 	try {
	// 		brand = await this.brandRepo.create(brand)
	// 		return new CreateBrandResponseDTO({ data: brand })
	// 	} catch (error) {
	// 		this.logger.error(error)
	// 		await this.removeBrandImage(brand._id)
	// 		throw error
	// 	}
	// }

}
