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
import { CategoryDTO, ObjectIdParam } from './dtos/common.dto'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SuccessResponseDTO } from '@libs'
import { Brand, BrandRepository } from '../database'
import {
	CreateBrandRequestDTO,
	CreateBrandResponseDTO,
} from './dtos/brand/create-brand.dtos'
import {
	FindBrandsQueryDTO,
	FindBrandsResponseDTO,
} from './dtos/brand/find-brands.dtos'
import { BrandDTO, BrandImage } from './dtos/brand/brand.dtos'
import {
	BrandNotFoundException,
	InvalidBrandLogoException,
} from '../errors/brand.errors'
import {
	UpdateBrandRequestDTO,
	UpdateBrandResponseDTO,
} from './dtos/brand/update-brand.dtos'
import { AdminAuth } from '@modules/admin/auth'
import { ImageUploader } from '@modules/admin/image-uploader'
import mongoose from 'mongoose'
import { PRODUCT_MODULE_CONFIG } from '../constants'
import { ProductModuleConfig } from '../interfaces'

@Controller('v1/admin/brands')
@ApiTags('Admin - Brand')
@UseInterceptors(ClassSerializerInterceptor)
@AdminAuth('apiKey')
export class BrandController {
	private readonly logger: Logger = new Logger(BrandController.name)
	private readonly brandImageBasePath
	constructor(
		@Inject(PRODUCT_MODULE_CONFIG)
		config: ProductModuleConfig,
		private readonly brandRepo: BrandRepository,
		private readonly imageUploader: ImageUploader,
	) {
		this.brandImageBasePath = config.basePaths.brand
	}

	@Post()
	@ApiResponse({
		status: 201,
		type: CreateBrandResponseDTO,
	})
	async create(
		@Body() dto: CreateBrandRequestDTO,
	): Promise<CreateBrandResponseDTO> {
		let brand: Brand = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			...dto,
		}
		await this.uploadBrandImage(brand, false)
		try {
			brand = await this.brandRepo.create(brand)
			return new CreateBrandResponseDTO({ data: brand })
		} catch (error) {
			this.logger.error(error)
			await this.removeBrandImage(brand._id)
			throw error
		}
	}

	@Get()
	@ApiResponse({
		status: 200,
		type: FindBrandsResponseDTO,
	})
	async findBrands(
		@Query() query: FindBrandsQueryDTO,
	): Promise<FindBrandsResponseDTO> {
		const result = await this.brandRepo.find(query)
		return new FindBrandsResponseDTO(result)
	}

	@Get('/:id')
	@ApiResponse({
		status: 200,
		type: BrandDTO,
	})
	async getById(@Param() { id }: ObjectIdParam): Promise<BrandDTO> {
		const brand = await this.brandRepo.getById(id)
		if (!brand) {
			throw new BrandNotFoundException(id)
		}
		return new BrandDTO(brand)
	}

	@Put('/:id')
	async update(
		@Param() { id }: ObjectIdParam,
		@Body() body: UpdateBrandRequestDTO,
	): Promise<UpdateBrandResponseDTO> {
		const brand: Brand = {
			_id: id,
			...body,
		}

		await this.uploadBrandImage(brand, true)
		await this.brandRepo.update(brand)

		return new UpdateBrandResponseDTO({ data: brand })
	}

	@Delete('/:id')
	@ApiOkResponse({
		status: 200,
		type: SuccessResponseDTO,
	})
	async delete(@Param() { id }: ObjectIdParam): Promise<void> {
		const brandId = await this.brandRepo.deleteById(id)
		if (!brandId) {
			throw new BrandNotFoundException(id)
		}
		return
	}

	@Get('/search/:keyword')
	@ApiResponse({
		status: 201,
		type: BrandDTO,
	})
	async searchCategoriesByKeyword(
		@Param('keyword') keyword: string,
	): Promise<FindBrandsResponseDTO> {
		const brands = await this.brandRepo.searchBrandsByKeyword(keyword)
		return new FindBrandsResponseDTO(brands)
	}

	private async uploadBrandImage(brand: Brand, remove = false) {
		if (remove) {
			await this.removeBrandImage(brand._id)
		}

		// TODO: Temporarily use `imageUrl` to identify brand logo. Should use `imageName` in the future instead
		const brandImageName = brand.brand_images.find(
			(image) => image.imageUrl === brand.brand_logoUrl,
		).imageName

		if (!brandImageName) {
			throw new InvalidBrandLogoException(brand.brand_logoUrl)
		}
		const brandId = brand._id
		const imageList = await Promise.all(
			brand.brand_images.map(async (image) => {
				const newImageUrl = await this.imageUploader.copyFromTempTo(
					image.imageUrl,
					`${this.brandImageBasePath}/${brandId}/${image.imageName}`,
				)
				image.imageUrl = newImageUrl
				return image
			}),
		)
		brand.brand_logoUrl = imageList.find(
			(image) => image.imageName === brandImageName,
		).imageUrl
	}

	private async removeBrandImage(brandId: string) {
		await this.imageUploader.removeImagesByFolder(
			`${this.brandImageBasePath}/${brandId}`,
		)
	}
}
