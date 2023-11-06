
import { AUTH_MODULE_CONFIG, AuthModuleConfig } from '@modules/admin/auth'

export default () => ({
	[AUTH_MODULE_CONFIG]: {
		apiKey: process.env.ADMIN_AUTH_API_KEY,
		bypassApiKey:
			process.env.DEBUG_ADMIN_AUTH_BYPASS_API_KEY === '1' ? true : false,
	} as AuthModuleConfig,
})
