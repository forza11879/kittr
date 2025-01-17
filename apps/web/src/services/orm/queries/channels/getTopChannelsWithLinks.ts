import { Prisma, prisma } from "@kittr/prisma"

interface Params {
	take: number
}

export const getTopChannelsWithLinksQuery = async ({ take }: Params) => {
	const result = await prisma.channel.findMany({
		where: {
			profile: {
				hasProfileImage: process.env.IS_DEV ? undefined : true
			}
		},
		orderBy: {
			viewCount: "desc"
		},
		take,
		include: {
			links: true,
			profile: {
				select: {
					hasProfileImage: true
				}
			}
		}
	})

	return result
}

export type getTopChannelsWithLinksQueryReturnType = Prisma.PromiseReturnType<typeof getTopChannelsWithLinksQuery>
