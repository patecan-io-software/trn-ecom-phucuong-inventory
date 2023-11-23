import { AUTH_MODULE_CONFIG, AuthModuleConfig } from '@modules/admin/auth'

export default () => ({
	[AUTH_MODULE_CONFIG]: {
		apiKey: process.env.ADMIN_AUTH_API_KEY,
		bypassApiKey:
			process.env.DEBUG_ADMIN_AUTH_BYPASS_API_KEY === '1' ? true : false,
		supabaseConfig: {
			url: process.env.SUPABASE_URL,
			serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
			jwtSecret: process.env.SUPABASE_JWT_SECRET,
		},
	} as AuthModuleConfig,
})
