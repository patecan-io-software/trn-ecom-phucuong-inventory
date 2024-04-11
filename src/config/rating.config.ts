export const RATING_CONFIG = 'RATING.CONFIG'

export default () => ({
	cronSchedule: process.env.cronSchedule || '* * * * *',
	expiredTime: process.env.expiredTime || '120',
})

export interface RatingConfig {
	expiredTime: string
	cronSchedule: string
}
