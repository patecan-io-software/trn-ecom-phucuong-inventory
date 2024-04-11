export default () => ({
	EXPIRED_TIME: process.env.EXPIRED_TIME || '60',
})

export interface RatingConfig {
	EXPIRED_TIME: string
}
