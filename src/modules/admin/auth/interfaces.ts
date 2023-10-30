export interface AuthModuleConfig {
	apiKey: string
	bypassApiKey?: boolean
}

export type AuthType = 'apiKey' | 'jwtToken'
