import colors from "@Colors"
import { paragraph } from "@Styles/typography"
import styled from "styled-components"

import { ChannelPcSpec } from "@kittr/prisma"
import { customOrderArray } from "@Utils/helpers/orderArrayByString"
import { GridItem, H2, SpecsGrid } from "./style"

const SORT_ORDER = ["Case", "CPU", "CPU Cooler", "Motherboard", "RAM", "GPU", "Storage", "Monitor", "Keyboard", "Mouse"]

interface Props {
	brandColor: string
	specs: ChannelPcSpec[]
}

const Specs = ({ specs, brandColor }: Props) => {
	if (Object.values(specs || {}).length === 0) return null

	return (
		<section id="specs">
			<H2>SPECS</H2>
			<SpecsGrid>
				{specs &&
					customOrderArray<ChannelPcSpec>({
						sortingArray: SORT_ORDER,
						indexToSort: 0,
						array: specs
					}).map((spec) => {
						const { partName, partType } = spec

						return (
							<GridItem key={partName} colorHover={brandColor}>
								<PartName>{partName}</PartName>
								<Part>{partType}</Part>
							</GridItem>
						)
					})}
			</SpecsGrid>
		</section>
	)
}

export default Specs

// Styled Components

const PartName = styled.h3`
	${paragraph};
	margin-bottom: 10px;
	color: ${colors.white};
	mix-blend-mode: difference;
`

const Part = styled.p`
	${paragraph};
	color: ${colors.lighter};
	mix-blend-mode: difference;
`
