import { createSSGHelper } from "@Server/createSSGHelper"
import { trpc } from "@Server/createHooks"

export default function IndexPage() {
	const hello = trpc.useQuery(["games/list"])

	if (!hello.data) {
		return <div>Loading...</div>
	}
	return (
		<div>
			<pre>{JSON.stringify(hello.data, null, 2)}</pre>
		</div>
	)
}

export const getStaticProps = async () => {
	const ssg = await createSSGHelper()

	await ssg.fetchQuery("games/list")

	return {
		props: {
			trpcState: ssg.dehydrate()
		}
	}
}