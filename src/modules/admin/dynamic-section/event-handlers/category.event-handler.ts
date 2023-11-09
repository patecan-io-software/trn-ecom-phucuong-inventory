import { CATEGORY_EVENTS } from '@modules/admin/product'
import { OnEvent } from '@nestjs/event-emitter'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
	Category,
	CategoryDeletedEvent,
	CategoryUpdatedEvent,
} from './category.events'
import { PageTemplateRepository } from '../database'
import { ImageSectionDTO } from '../controllers/dto/page-template/page-template.dtos'
import { DYNAMIC_SECTION_MODULE_CONFIG } from '../constants'
import { DynamicSectionModuleConfig } from '../interfaces'

@Injectable()
export class CategoryEventHandler {
	private readonly DEFAULT_TEMPLATE_NAME = 'default'
	private readonly logger: Logger = new Logger(CategoryEventHandler.name)
	constructor(
		private readonly pageTemplateRepo: PageTemplateRepository,
		@Inject(DYNAMIC_SECTION_MODULE_CONFIG)
		private readonly config: DynamicSectionModuleConfig,
	) {}

	@OnEvent(CATEGORY_EVENTS.OnUpdated)
	async onCategoryUpdated(event: CategoryUpdatedEvent) {
		const template = await this.pageTemplateRepo.getByName(
			this.DEFAULT_TEMPLATE_NAME,
		)
		if (!template) {
			this.logger.warn('Template default is not found')
			return
		}

		const categoryBanner = template.section_list.find(
			(section) => section.name === 'category_section',
		) as ImageSectionDTO
		const categorySlider = template.section_list.find(
			(section) => section.name === 'category_slider',
		) as ImageSectionDTO

		const { category } = event

		let bannerUpdated, categorySliderUpdated

		categoryBanner &&
			(bannerUpdated = this.updateImage(category, categoryBanner))
		categorySlider &&
			(categorySliderUpdated = this.updateImage(category, categorySlider))

		if (bannerUpdated || categorySliderUpdated) {
			this.logger.log(
				`Update of category with id ${category._id} triggers update page template default`,
			)
			await this.pageTemplateRepo.save(template)
		}
	}

	@OnEvent(CATEGORY_EVENTS.OnDeleted)
	async onCategoryDeleted(event: CategoryDeletedEvent) {
		const template = await this.pageTemplateRepo.getByName(
			this.DEFAULT_TEMPLATE_NAME,
		)
		if (!template) {
			this.logger.warn('Template default is not found')
			return
		}

		const categoryBanner = template.section_list.find(
			(section) => section.name === 'category_section',
		) as ImageSectionDTO
		const categorySlider = template.section_list.find(
			(section) => section.name === 'category_slider',
		) as ImageSectionDTO

		const { category } = event

		let bannerUpdated, categorySliderUpdated
		categoryBanner &&
			(bannerUpdated = this.removeImage(category, categoryBanner))
		categorySlider &&
			(categorySliderUpdated = this.removeImage(category, categorySlider))

		if (bannerUpdated || categorySliderUpdated) {
			this.logger.log(
				`Deletion of category with id ${category._id} triggers update page template default`,
			)
			await this.pageTemplateRepo.save(template)
		}
	}

	private updateImage(category: Category, imageSection: ImageSectionDTO) {
		const { categoryLinkFunc } = this.config
		const image = imageSection.image_list.find((image) =>
			image.link_url.includes(category._id),
		)
		if (!image) {
			return false
		}
		image.display_text = category.category_name
		image.image_url = category.category_logoUrl
		image.link_url = categoryLinkFunc(category._id)

		return true
	}

	private removeImage(category: Category, imageSection: ImageSectionDTO) {
		const imageIndex = imageSection.image_list.findIndex((image) =>
			image.link_url.includes(category._id),
		)
		if (imageIndex === -1) {
			return false
		}
		imageSection.image_list.splice(imageIndex, 1)
		return true
	}
}
