import {
	IMAGE_UPLOADER_CONFIG,
	ImageUploaderConfig,
} from '@modules/admin/image-uploader'

export default () => ({
	[IMAGE_UPLOADER_CONFIG]: {
		bucketName: process.env.SUPABASE_BUCKET_NAME,
		uploadPath: process.env.SUPABASE_UPLOAD_PATH,
		supabaseKey: process.env.SUPABASE_KEY,
		supabaseUrl: process.env.SUPABASE_URL,
	} as ImageUploaderConfig,
})
