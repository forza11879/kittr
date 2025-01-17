import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
	dsn: SENTRY_DSN,
	environment: process.env.IS_DEV ? "development" : process.env.VERCEL_ENV,
	tracesSampleRate: 1.0,
	beforeSend: (event) => {
		if (event.tags.isKittr) {
			return event
		}
		return null
	}
})
