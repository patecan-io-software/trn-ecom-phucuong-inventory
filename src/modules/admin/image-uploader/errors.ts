import { BaseException } from '@libs'

export class UploadFileFailedException extends BaseException {
	public code = 'UPLOAD_FILE_FAILED'

	constructor(message: string) {
		super(message)
	}
}
