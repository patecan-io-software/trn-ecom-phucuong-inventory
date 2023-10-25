import { BaseException } from '@libs'

export class UploadFileFailedException extends BaseException {
	public code = 'UPLOAD_FILE_FAILED'

	constructor(message: string) {
		super(message)
	}
}

export class RemoveFileFailedException extends BaseException {
	public code = 'REMOVE_FILE_FAILED'

	constructor(message: string) {
		super(message)
	}
}
