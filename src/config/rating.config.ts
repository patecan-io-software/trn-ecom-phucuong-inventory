import { RATING_MODULE_CONFIG, RatingModuleConfig } from '@modules/rating'

export default () => ({
	[RATING_MODULE_CONFIG]: {
		cronScheduleTime: process.env.CRON_SCHEDULE_TIME,
		ratingDurationInSecond: process.env.CRON_RATING_DUATION_IN_SECOND,
	} as RatingModuleConfig,
})
