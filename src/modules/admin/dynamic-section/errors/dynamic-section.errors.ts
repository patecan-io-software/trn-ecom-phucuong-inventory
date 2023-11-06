import { BaseException } from '@libs'

export class CampaignExistsException extends BaseException {
	public code = 'CAMPAIGN_EXISTS'

	constructor(campaignName: string) {
		super(`Campaign with name '${campaignName}' already exists`)
	}
}
