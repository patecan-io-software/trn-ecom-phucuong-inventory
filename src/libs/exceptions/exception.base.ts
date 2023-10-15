export abstract class BaseException extends Error {
	public abstract readonly code: string
	public readonly message: string

	constructor(message: string) {
		super(message)
	}
}
