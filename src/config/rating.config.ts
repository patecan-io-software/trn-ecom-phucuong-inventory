export default () => ({
	EXPIRED_TIME: process.env.EXPIRED_TIME || '600',
})

export interface RatingConfig {
	EXPIRED_TIME: string
}
