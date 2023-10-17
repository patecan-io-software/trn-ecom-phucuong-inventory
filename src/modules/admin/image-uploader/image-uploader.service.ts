import { createClient } from '@supabase/supabase-js'
import { ImageUploaderConfig } from './interfaces'
import { UploadFileFailedException } from './errors'
import { Inject, Logger } from '@nestjs/common'
import { IMAGE_UPLOADER_CONFIG } from './constants'

export class ImageUploader {
	private readonly logger = new Logger(ImageUploader.name)
	private readonly PUBLIC_URL_PATH = 'storage/v1/object/public'
	constructor(
		@Inject(IMAGE_UPLOADER_CONFIG)
		private readonly config: ImageUploaderConfig,
	) {}

	async upload(file: Express.Multer.File) {
		const { supabaseUrl, supabaseKey, uploadPath, bucketName } = this.config
		const supabase = createClient(supabaseUrl, supabaseKey)

		// Upload the image to Supabase storage
		let fileName: string
		const parts = file.originalname.split('.')
		if (parts.length === 1) {
			fileName = parts[0].concat(`_${Date.now()}`)
		} else {
			const ext = parts.pop()
			fileName = parts
				.join('.')
				.concat(`_${Date.now()}`)
				.concat(`.${ext}`)
		}
		const path = `${uploadPath}/${fileName}`
		const { data, error } = await supabase.storage
			.from(bucketName)
			.upload(path, file.buffer)

		if (error) {
			throw new UploadFileFailedException(error.message)
		}

		this.logger.debug(
			`File uploaded to Supabase storage successfully. Path: ${path}`,
		)

		return `${supabaseUrl}/${this.PUBLIC_URL_PATH}/${bucketName}/${path}`
	}
}
