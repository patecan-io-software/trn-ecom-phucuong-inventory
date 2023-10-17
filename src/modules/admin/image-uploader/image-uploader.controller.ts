import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageUploader } from './image-uploader.service'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'

@Controller('/image')
@ApiTags('Admin - Image Upload')
export class ImageUploaderController {
	constructor(private readonly imageUploader: ImageUploader) {}

	@Post('/upload')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		const fileUrl = await this.imageUploader.upload(file)
		return {
			fileUrl,
		}
	}
}
