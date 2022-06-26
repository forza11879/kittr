import { Prisma } from "@kittr/prisma"
import { serializeGame } from "../../../utils/serializers/game"

const include = Prisma.validator<Prisma.ChannelArgs>()({
	include: {
		profile: {
			include: {
				brandColors: true,
				channelPcSpecs: true,
				affiliates: true,
				setupPhotos: true
			}
		},
		warzoneKits: {
			orderBy: {
				base: {
					displayName: "asc"
				}
			},
			include: {
				base: {
					include: {
						category: true
					}
				},
				options: true
			}
		},
		links: true,
		plan: true,
		games: true,
		gameAffiliateCodes: {
			include: {
				game: true
			}
		}
	}
})

type CompleteFullChannel = Prisma.ChannelGetPayload<typeof include>

export const serializeFullChannelProfile = (channel: CompleteFullChannel) => {
	const serializedChannel = {
		...channel,
		createdAt: channel.createdAt.toISOString(),
		games: channel.games.map((game) => serializeGame(game)),
		gameAffiliateCodes: channel.gameAffiliateCodes.map((gameAffiliateCode) => ({
			...gameAffiliateCode,
			game: serializeGame(gameAffiliateCode.game)
		}))
	}

	return serializedChannel
}

export type SerializeFullChannelProfileReturnType = ReturnType<typeof serializeFullChannelProfile>
