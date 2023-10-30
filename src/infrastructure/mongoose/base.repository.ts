import { v4 as uuidv4 } from 'uuid'
import { ClientSession, Connection } from 'mongoose'

export abstract class BaseRepository {
	protected static sessionList: Map<string, ClientSession> = new Map()
	protected readonly session: ClientSession

	constructor(
		protected readonly connection: Connection,
		protected readonly _sessionId?: string,
	) {
		this.session = _sessionId
			? BaseRepository.sessionList.get(_sessionId)
			: undefined
	}

	get sessionId() {
		return this._sessionId
	}

	getRepositoryTransaction<T extends BaseRepository>(sessionId: string): T {
		const session = BaseRepository.sessionList.get(sessionId)
		if (!session) {
			throw new Error('Session not found: ' + sessionId)
		}
		const repository = this.clone(sessionId)
		return repository
	}

	async startTransaction<T extends BaseRepository>(): Promise<T> {
		const sId = uuidv4()
		let session = BaseRepository.sessionList.get(sId)
		session = await this.connection.startSession()
		session.startTransaction({
			explain: true,
		})
		BaseRepository.sessionList.set(sId, session)
		const repository = this.clone(sId)
		return repository
	}

	async commitTransaction() {
		if (this.session) {
			await this.session.commitTransaction()
			await this.session.endSession()
			BaseRepository.sessionList.delete(this._sessionId)
		}
	}
	async abortTransaction() {
		if (this.session) {
			await this.session.abortTransaction()
			await this.session.endSession()
			BaseRepository.sessionList.delete(this._sessionId)
		}
	}

	protected abstract clone(sessionId: string): any
}
