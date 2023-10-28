import {
	IMAGE_UPLOADER_CONFIG,
	ImageUploaderConfig,
} from '@modules/admin/image-uploader'

export default () => ({
	[IMAGE_UPLOADER_CONFIG]: {
		bucketName: process.env.SUPABASE_BUCKET_NAME,
		supabaseKey: process.env.SUPABASE_KEY,
		supabaseUrl: process.env.SUPABASE_URL,
		tempPath: 'temp',
		defaultPath: 'default',
	} as ImageUploaderConfig,
})
