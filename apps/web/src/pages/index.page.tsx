import PageWrapper from "@Components/layouts/PageWrapper"
import { trpc } from "@Server/createHooks"
import { createSSGHelper } from "@Server/createSSGHelper"
import ResponsiveAdBanner from "@Services/venatus/ResponsiveBanner"
import { connectToDatabase } from "@Utils/helpers/connectToDatabase"
import Body from "./Home/Body"
import Hero from "./Home/Hero"
import PlatformInfo from "./Home/PlatformInfo"

const Home = () => {
	const { data: games } = trpc.useQuery(["games/list"])
	const { data: totalNumberOfKits } = trpc.useQuery(["kits/count"])
	const { data: popularChannels } = trpc.useQuery(["channels/top"])
	const { data: risingChannels } = trpc.useQuery(["channels/rising"])
	const { data: liveChannels } = trpc.useQuery(["channels/live"])

	return (
		<PageWrapper title="Home | kittr" description="Where the pros post their kits. Get kitted.">
			<Hero totalNumberOfKits={totalNumberOfKits} />
			<ResponsiveAdBanner />
			<Body
				games={games}
				popularChannels={popularChannels}
				risingStars={risingChannels}
				liveChannels={liveChannels?.slice(0, 15)}
			/>
			<ResponsiveAdBanner />
			<PlatformInfo />
			<ResponsiveAdBanner largeWidthAdUnit="d728x90" smallWidthAdUnit="s300x250" />
		</PageWrapper>
	)
}

export default Home

export const getStaticProps = async () => {
	await connectToDatabase()

	const ssg = await createSSGHelper()

	// TODO: Do we want to Promise.all this or does it already do it through tRPC magic?
	await ssg.fetchQuery("kits/count")
	await ssg.fetchQuery("games/list")
	await ssg.fetchQuery("channels/top")
	await ssg.fetchQuery("channels/rising")
	await ssg.fetchQuery("channels/live")

	return {
		props: {
			trpcState: ssg.dehydrate()
		},
		revalidate: 60
	}
}
