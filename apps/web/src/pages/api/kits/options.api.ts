import { prisma } from "@kittr/prisma"
import { createHandler } from "@Utils/middlewares/createHandler"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = createHandler()

// Fetch options by kit
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	const { kitBaseId } = req.query as { kitBaseId: string }

	try {
		const result = await prisma.warzoneKitOption.findMany({
			where: {
				kitBaseId
			}
		})

		return res.status(200).json(result)
	} catch (error) {
		return res.status(500).json({ error })
	}
})

export default handler
