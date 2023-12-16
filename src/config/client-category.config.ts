import {
	CATEGORY_MODULE_CONFIG,
	ClientCategoryModuleConfig,
} from '@modules/client/category'

export default () => ({
	[CATEGORY_MODULE_CONFIG]: {
		cacheTTL: process.env.CACHE_TIME_IN_SECOND
			? parseInt(process.env.CACHE_TIME_IN_SECOND) * 1000
			: 0, // disable cache
	} as ClientCategoryModuleConfig,
})
