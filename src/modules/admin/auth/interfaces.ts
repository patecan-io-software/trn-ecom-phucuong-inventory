export interface AuthModuleConfig {
	apiKey: string
	apiSecret: string
	bypassApiKey?: boolean
}

export type AuthType = 'apiKey' | 'jwtToken'

export interface AuthTokenPayload {
	sub: string
	email: string
	phone: string
	app_metadata: {
		provider: string
		providers: string[]
	}
	user_metadata: {
		role: string
	}
	role: string
	session_id: string
}
