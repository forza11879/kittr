import { gamesRouter } from "@Server/routers/games"
import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server"
import superjson from "superjson"
import { createRouter } from "./createRouter"
import { adminRouter } from "./routers/admin"
import { channelsRouter } from "./routers/channels"
import { kitsRouter } from "./routers/kits"
import { managersRouter } from "./routers/managers"
import { twitchRouter } from "./routers/twitch"

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("games/", gamesRouter)
	.merge("channels/", channelsRouter)
	.merge("managers/", managersRouter)
	.merge("kits/", kitsRouter)
	.merge("twitch/", twitchRouter)
	.merge("admin/", adminRouter)

export type AppRouter = typeof appRouter

/** Enum containing all api query paths */
export type TQuery = keyof AppRouter["_def"]["queries"]

/** Enum containing all api mutation paths */
export type TMutation = keyof AppRouter["_def"]["mutations"]
export type TMutationPaths = AppRouter["_def"]["mutations"]

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>

/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<AppRouter["_def"]["queries"][TRouteKey]>

/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> = inferProcedureOutput<
	AppRouter["_def"]["mutations"][TRouteKey]
>

/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> = inferProcedureInput<
	AppRouter["_def"]["mutations"][TRouteKey]
>
