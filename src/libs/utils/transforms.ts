import { isNullOrUndefined } from './checkers'

export const TransformQueryString = (params) => params.value || undefined
export const TransformQueryBoolean = (params) =>
	isNullOrUndefined(params.value)
		? undefined
		: params.value === '1'
		? true
		: false
