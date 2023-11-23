import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	UseInterceptors,
} from '@nestjs/common'
import { PageTemplateRepository } from '../database'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { PageTemplateDTO } from './dto/page-template/page-template.dtos'
import { PageTemplateNotFoundException } from '../errors/page-template.errors'

@Controller('v1/page-templates')
@ApiTags('Client - Page Template')
@UseInterceptors(ClassSerializerInterceptor)
export class ClientPageTemplateDefaultController {
	constructor(private readonly pageTemplateRepo: PageTemplateRepository) {}

	@Get('/:name')
	@ApiResponse({
		status: 200,
		type: PageTemplateDTO,
	})
	async getPageTemplate(
		@Param('name') templateName: string,
	): Promise<PageTemplateDTO> {
		// temporarily handle default page template only
		const pageTemplate = await this.pageTemplateRepo.getByName(templateName)

		if (!pageTemplate) {
			throw new PageTemplateNotFoundException(templateName)
		}

		pageTemplate.section_list = pageTemplate.section_list.filter(
			(section) => section.is_active,
		)

		return new PageTemplateDTO(pageTemplate)
	}
}
