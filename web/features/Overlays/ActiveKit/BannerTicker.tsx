import { useState, useEffect, useRef, Dispatch, SetStateAction, RefObject } from "react"
import styled, { keyframes, ThemeProvider } from "styled-components"

import { customOrderArray } from "@Utils/helpers/orderArrayByString"
import { warzoneSlotsOrder } from "@Utils/lookups/warzoneSlotsOrder"
import { download } from "@Services/firebase/storage/download"
import { header1, header2, montserrat, paragraph } from "@Styles/typography"
import { usePreviousValue } from "@Hooks/usePreviousValue"

interface Props {
	_id: string
	previewWidth?: number
	data: any
	activeKit: IKit
	setActiveKit: Dispatch<SetStateAction<IKit>>
}

const BannerTicker = ({ _id, previewWidth, data, activeKit, setActiveKit }: Props) => {
	const [background, setBackground] = useState("")
	const [isUsingCustomBackground, setIsUsingCustomBackground] = useState(true)
	const [isOverlayReady, setIsOverlayReady] = useState(false)
	const [isDataVisible, setIsDataVisible] = useState(true)
	const prevUuid = usePreviousValue(data?.uuid)
	const optionsRef = useRef<any>(null)

	const SCROLL_DURATION = Object.keys(activeKit || {}).length ? activeKit.options.length * 4 : 0
	const FADE_DURATION = 0.2

	// Handle two kits at once
	// Use a timeout to switch between multiple kits if needed
	useEffect(() => {
		let timeout: any = null

		const delay = async (period: number) => {
			return await new Promise((resolve) => {
				timeout = setTimeout(() => {
					resolve(null)
					clearTimeout(timeout)
				}, period)
			})
		}

		const showItem = async () => {
			setIsDataVisible(true)

			if (activeKit.options) {
				await delay(SCROLL_DURATION * 1000)
			}

			setIsDataVisible(false)
			await delay(FADE_DURATION * 1000)

			if (activeKit._id === data.primaryKit._id) {
				setActiveKit(data.secondaryKit)
			} else {
				setActiveKit(data.primaryKit)
			}
		}

		if (data) {
			const kitCount = [data.primaryKit, data.secondaryKit].filter(
				(kit) => !!kit && Object.keys(kit || {}).length > 0
			).length

			if (kitCount > 1) {
				showItem()
			}
		}

		return () => clearTimeout(timeout)
	}, [data, activeKit])

	// Handle changing backgrounds
	// Comparing the uuids has to happen so that the browser knows to refetch the background
	useEffect(() => {
		try {
			if (data?.uuid !== prevUuid) {
				download(`${_id}-kit-overlay-banner-ticker`, async (image) => {
					if (!image) {
						setIsUsingCustomBackground(false)
						setBackground("")
						return setIsOverlayReady(true)
					}

					setBackground(image)
				})
			}
		} catch (error) {
			console.error(error)
		}
	}, [download, data])

	if (!data) return null

	const hasAKitSelected =
		Object.keys(data.primaryKit || {}).length > 0 || Object.keys(data.secondaryKit || {}).length > 0
	const isRendered = data.isOverlayVisible === "on" && hasAKitSelected && isOverlayReady
	const isOverlayVisible = !!previewWidth || isRendered

	return (
		<ThemeProvider
			theme={{
				...data,
				isOverlayVisible: isOverlayVisible && hasAKitSelected,
				customBackground: background,
				previewWidth
			}}
		>
			{isUsingCustomBackground && (
				<img
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						zIndex: -1,
						width: "0",
						height: "0"
					}}
					src={background + new Date().getTime()}
					onLoad={() => setIsOverlayReady(true)}
				/>
			)}
			<Wrapper>
				<Meta>
					<BaseName isDataVisible={isDataVisible} fadeDuration={FADE_DURATION}>
						{activeKit?.base?.displayName}
					</BaseName>
					<CommandInfo isDataVisible={isDataVisible} fadeDuration={FADE_DURATION}>
						kittr.gg | !{activeKit?.base?.commandCodes[0]}
					</CommandInfo>
				</Meta>
				<OptionsWrapper>
					<Options
						isDataVisible={isDataVisible}
						duration={SCROLL_DURATION}
						ref={optionsRef}
						scrollValue={optionsRef.current ? optionsRef.current.scrollWidth - optionsRef.current.clientWidth : 0}
						fadeDuration={FADE_DURATION}
					>
						{activeKit &&
							customOrderArray<{ slotKey: string; displayName: string }>({
								sortingArray: warzoneSlotsOrder,
								keyToSort: "slotKey",
								array: activeKit.options || []
							}).map((elem: any, _: any) => {
								return (
									<Option key={elem.displayName}>
										<Slot>{elem.slotKey}</Slot>
										<Selection>{elem.displayName.toUpperCase()}</Selection>
									</Option>
								)
							})}
					</Options>
				</OptionsWrapper>
			</Wrapper>
		</ThemeProvider>
	)
}

export default BannerTicker

// Styled Components

const Wrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	width: 1920px;
	height: 32px;
	background-image: url("${(props) => props.theme.customBackground}");
	background-size: 100% 100%;
	background-repeat: no-repeat;
	top: ${(props) => (props.theme.isOverlayVisible ? "0px" : "32px")};
	opacity: ${(props) => (props.theme.isOverlayVisible ? 1 : 0)};
	transition: 0.4s;
	background-color: ${(props) =>
		props.theme.customBackground ? props.theme.customBackground : props.theme.backgroundColorPrimary};
	transform: ${(props) => (props.theme.previewWidth ? `scale(${Math.min(1, props.theme.previewWidth / 1920)})` : "")};
`

const Meta = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	padding: 0 44px;
	white-space: nowrap;

	background-color: ${(props) =>
		props.theme.customBackground ? props.theme.customBackground : props.theme.backgroundColorSecondary};
`

const BaseName = styled.p<{ isDataVisible: boolean; fadeDuration: number }>`
	${header2};
	color: ${(props) => props.theme.textColorPrimary};
	opacity: ${(props) => (props.isDataVisible ? 1 : 0)};
	transition: ${(props) => props.fadeDuration}s;
`

const CommandInfo = styled.p<{ isDataVisible: boolean; fadeDuration: number }>`
	margin-left: 44px;
	${paragraph};
	color: ${(props) => props.theme.textColorAccent};
	font-weight: 700;
	opacity: ${(props) => (props.isDataVisible ? 1 : 0)};
	transition: ${(props) => props.fadeDuration}s;
`

const OptionsWrapper = styled.div`
	flex: 1;
	height: 32px;
	overflow: hidden;
	background-color: ${(props) =>
		props.theme.customBackground ? props.theme.customBackground : props.theme.backgroundColorPrimary};
`

const marquee = (duration: number, scrollValue: number) => keyframes`
    ${(2 / duration) * 100}% {
        transform: translate(0, 0)
    }

    ${100 - (2 / duration) * 100}%, 100% {
         transform: translate(-${scrollValue + 24}px, 0)
    }
`

const Options = styled.div<{ isDataVisible: boolean; duration: number; scrollValue: number; fadeDuration: number }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 32px;
	text-align: center;
	animation: ${(props) => marquee(props.duration, props.scrollValue)} ${(props) => props.duration}s infinite alternate
		linear;
	opacity: ${(props) => (props.isDataVisible ? 1 : 0)};
	transition: ${(props) => props.fadeDuration}s;
`

const Option = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-left: 68px;

	&:first-child {
		margin-left: 24px;
	}
`

const Slot = styled.p`
	display: inline-block;
	color: ${(props) => props.theme.textColorSecondary};
	${montserrat};
	font-weight: 600;
	font-size: 18px;
	white-space: nowrap;
`

const Selection = styled.p`
	display: inline-block;
	width: 90%;
	margin-left: 24px;
	color: ${(props) => props.theme.textColorPrimary};
	${header1};
	font-size: 24px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`