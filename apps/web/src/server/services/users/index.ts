import admin from "firebase-admin"
import { TRPCError } from "@trpc/server"
import {prisma, ChannelManagerRoles } from "@kittr/prisma"

export const getUserByEmail = async (email: string) => {
	const user = await admin.auth().getUserByEmail(email)

	if (!user) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Couldn't find user with that email."
		})
	}

	return user
}

export const verifyIdToken = async (token: string) => {
	const user = await admin.auth().verifyIdToken(token)

	if (!user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Invalid token."
		})
	}

	return user
}

export const checkRole = async ({
	firebaseUserId,
	channelId,
	roles
}: {
	firebaseUserId: string
	channelId: string
	roles: ChannelManagerRoles[]
}) => {
	const manager = await prisma.channelManager.findFirst({
		where: {
			channelId: channelId,
			firebaseId: firebaseUserId
		}
	})

	if (!manager) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You are not a manager of this channel."
		})
	}

	const hasPermission = roles.some((role) => manager.role === role)

	if (!hasPermission) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You do not have permission to do that."
		})
	}

	return manager
}





const yaya = async ({kitBaseId}: {kitBaseId: string}) => {
	const thingy = await prisma.channel.findMany({
		where: {
			kits: {
					options: {
						some: {
							id: optionid
						}
					}
				}
			}
		},
		select: {

		}

	})
}

// What percentage of Ak47s have the Silencer on them?
// What percentage of kits use the Silencer?
// How many channels use the Silencer on their M4?
// 
