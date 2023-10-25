import {
	PRODUCT_MODULE_CONFIG,
	ProductModuleConfig,
} from '@modules/admin/product'

export default () => ({
	[PRODUCT_MODULE_CONFIG]: {
		basePaths: {
			brand: 'brand',
			category: 'category',
			product: 'product',
		},
	} as ProductModuleConfig,
})
