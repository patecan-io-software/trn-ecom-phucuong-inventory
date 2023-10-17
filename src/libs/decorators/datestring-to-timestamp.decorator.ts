import { Transform } from 'class-transformer'

export const DateStringToTimestamp = () =>
	Transform(({ value }) => value?.getTime?.() || null)
