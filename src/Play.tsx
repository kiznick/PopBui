import { Button, ScrollShadow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Progress, Chip } from '@nextui-org/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { CheckCircleIcon, LinkIcon } from '@heroicons/react/24/solid'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import config from './config'

type LeaderboardType = {
	rank: number
	username: string
	count: number
}

type MileStoneType = {
	count: number
	message: string
	reward: string | null
	rewardUrl: string | null
}

const unit = 'Hiw'

function Play() {
	const medalEmoji: { [key: number]: string } = {
		1: '🥇',
		2: '🥈',
		3: '🥉',
	}

	const usernameModal = useDisclosure()
	const MilestoneModal = useDisclosure()
	const { executeRecaptcha } = useGoogleReCaptcha()

	const [isClicked, setIsClicked] = useState(false)
	const [count, setCount] = useState(0)
	const [timeLeft, setTimeLeft] = useState(config.second)
	const [isRunning, setIsRunning] = useState(false)
	const [isLockButton, setIsLockButton] = useState(false)
	const [isOpenLeaderboard, setIsOpenLeaderboard] = useState(false)
	const [username, setUsername] = useState('')
	const [inputUsernameError, setInputUsernameError] = useState('')
	const [inputUsername, setInputUsername] = useState('')
	const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardType[]>([])
	const [highestLeaderboard, setHighestLeaderboard] = useState<LeaderboardType[]>([])
	const [totalPop, setTotalPop] = useState(0)
	const [mileStone, setMileStone] = useState<MileStoneType[]>([])
	const [currentMileStone, setCurrentMileStone] = useState<MileStoneType | null>(null)

	const numberWithCommas = (n: string | number) => {
		return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	useEffect(() => {
		const sendData = async () => {
			if (!executeRecaptcha) return alert('Recaptcha not ready yet.')

			if (count === 0) return
			if (count > config.second * config.maxClickPerSecond) return alert('You clicked too much.')

			const token = await executeRecaptcha('kiznick')
			const response = await axios.post(`${config.apiServer}kiznick`, {
				token,
				username,
				count,
			})

			if (response.data.error) {
				alert(response.data.message)
			}
		}

		if (!isRunning && count > 0 && username) {
			sendData()
		}
	}, [count, executeRecaptcha, isRunning, username])

	useEffect(() => {
		let intervalId = undefined

		if (isRunning && timeLeft > 0) {
			intervalId = setInterval(() => {
				setTimeLeft(timeLeft - 1)
			}, 1000)
		} else if (isRunning && timeLeft <= 0) {
			setIsRunning(() => false)
			setTimeout(() => {
				setIsLockButton(() => false)
			}, 400)
		}

		return () => {
			clearInterval(intervalId)
		}
	}, [isRunning, timeLeft])

	useEffect(() => {
		const updateLeaderboard = async () => {
			try {
				const response = await axios.get(`${config.apiServer}leaderboard`)
				if (response.data.error) {
					return alert(response.data.message)
				}
				const leaderboard = response.data

				setTotalLeaderboard(leaderboard.totalRanking)
				setHighestLeaderboard(leaderboard.highestRanking)
				setTotalPop(leaderboard.totalPop)
			} catch (error) {
				console.error('Error updating leaderboard:', error)
			}
		}

		updateLeaderboard()
		const interval = setInterval(() => {
			updateLeaderboard()
		}, 1000 * 2)

		return () => {
			clearInterval(interval)
		}
	}, [])

	useEffect(() => {
		const updateMilestone = async () => {
			const response = await axios.get(`${config.apiServer}milestone`)

			if (response.data.error) {
				return alert(response.data.message)
			}

			setMileStone(response.data)
		}

		updateMilestone()
		const Interval = setInterval(() => {
			updateMilestone()
		}, 1000 * 5)

		return () => {
			clearInterval(Interval)
		}
	}, [])

	useEffect(() => {
		if (!mileStone) return

		const currentMileStone = mileStone.find((item: MileStoneType) => totalPop < item.count) || null
		setCurrentMileStone(currentMileStone)
	}, [totalPop, mileStone])

	useEffect(() => {
		const localUsername = localStorage.getItem('k-username')?.toLowerCase()

		if (!localUsername) return
		if (localUsername.length > 20) return
		if (!/^[a-z0-9 ]*$/.test(localUsername)) return

		setUsername(localUsername)
	}, [])

	useEffect(() => {
		const popSound = new Howl({
			src: ['/pop.mp3'],
			volume: 1
		})

		const handleMouseDown = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			if (!isRunning && target.closest('.leaderboard')) return

			setIsOpenLeaderboard(false)

			if (!isRunning) return
			if (isClicked) return

			popSound.play()
			setCount((prevCount) => prevCount + 1)
			setIsClicked(true)
		}

		const handleMouseUp = () => {
			setIsClicked(false)
		}

		window.addEventListener('pointerdown', handleMouseDown)
		window.addEventListener('pointerup', handleMouseUp)
		window.addEventListener('contextmenu', (e) => {
			e.preventDefault()
		})

		return () => {
			window.removeEventListener('pointerdown', handleMouseDown)
			window.removeEventListener('pointerup', handleMouseUp)
		}
	}, [isClicked, isRunning])

	const Start = () => {
		if (isLockButton) return

		if (!username) {
			setInputUsername('')
			return usernameModal.onOpen()
		}

		if (!executeRecaptcha) {
			return alert('Recaptcha not ready yet.')
		}

		setCount(0)
		setTimeLeft(config.second)
		setIsRunning(true)
		setIsLockButton(true)
		setIsOpenLeaderboard(false)
	}

	return (
		<>
			<div
				className='container mx-auto flex flex-col justify-between'
				onClick={(e) => {
					const target = e.target as HTMLElement
					if (!isRunning && target.closest('.leaderboard')) return

					Start()
				}}
			>
				<div
					className="py-4 px-5 text-center flex items-center select-none"
				>
					<div className="mx-auto">
						<p
							className="text-7xl lg:text-8xl"
						>
							Pop{unit}
						</p>
						<p>
							Click as much as you can in {config.second} seconds.
						</p>
						<p
							className='text-4xl lg:text-5xl'
						>
							<span className="font-bold">{timeLeft}</span>s | <span className="font-bold">{count}</span> {unit}
						</p>
						<p
							className='text-xl flex items-center justify-center gap-2 mt-5'
						>
							{
								username ? (
									<>
										Welcome, {username || 'Guest'}
										<div
											className="h-8 w-8"
											style={{
												visibility: isRunning ? 'hidden' : 'visible',
											}}
											onClick={() => {
												if (isRunning) return

												setCount(0)
												setUsername('')
											}}
										>
											<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
												<path d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
											</svg>
										</div>
									</>
								) : (
									<span
										onClick={() => {
											if (!username) {
												setInputUsername('')
												return usernameModal.onOpen()
											}
										}}
									>
										Please click Start button to enter your name !
									</span>
								)
							}
						</p>
						<Button
							className='mt-5'
							disabled={isLockButton}
							onClick={Start}
							style={{
								visibility: isRunning ? 'hidden' : 'visible',
							}}
						>
							{
								isLockButton ? 'Wait' : 'Start'
							}
						</Button>
						<img
							src={isClicked ? '/2.png' : '/1.png'}
							className="mx-auto max-w-full max-h-80"
						/>
						{
							currentMileStone ? (
								<>
									<Progress
										label={`${currentMileStone.message} if everyone reaches ${numberWithCommas(currentMileStone.count)} ${unit}. (${numberWithCommas(totalPop)}/${numberWithCommas(currentMileStone.count)} ${unit})`}
										value={totalPop}
										maxValue={currentMileStone.count}
										color={totalPop >= currentMileStone.count ? 'success' : 'primary'}
										onClick={() => {
											if (isRunning) return

											MilestoneModal.onOpen()
										}}
									/>
									<p
										className="mt-2"
										style={{
											visibility: isRunning ? 'hidden' : 'visible',
										}}
										onClick={() => {
											if (isRunning) return

											MilestoneModal.onOpen()
										}}
									>
										Click here to view more MileStone !
									</p>
								</>
							) : mileStone ? (
								<>
									<Progress
										label={`No more MileStone ;( (${numberWithCommas(totalPop)} ${unit})`}
										value={1}
										maxValue={1}
										color={'success'}
										onClick={() => {
											if (isRunning) return

											MilestoneModal.onOpen()
										}}
									/>
									<p
										className="mt-2"
										style={{
											visibility: isRunning ? 'hidden' : 'visible',
										}}
										onClick={() => {
											if (isRunning) return

											MilestoneModal.onOpen()
										}}
									>
										Click here to view past MileStone !
									</p>
								</>
							) : 'Loading...'
						}
					</div>
				</div>
				<motion.div
					className={`fixed bottom-0 left-0 z-40 w-screen flex items-center justify-center leaderboard`}
					style={{
						margin: '0 auto',
						height: '3.5rem',
					}}
					animate={{
						height: isOpenLeaderboard ? '50vh' : '3.5rem',
					}}
				>
					<div
						className="w-full h-full overflow-y-none bg-gray-50 rounded-t-large max-w-3xl"
					>
						{
							isOpenLeaderboard ? (
								<p
									className="px-4 pt-4 text-3xl cursor-pointer"
									onClick={() => {
										if (isRunning) return

										setIsOpenLeaderboard(false)
									}}
								>
									Leaderboard
									<span className="float-right mr-2">X</span>
								</p>
							) : (
								<div
									className="flex flex-row py-4 px-0 text-black cursor-pointer"
									onClick={() => {
										if (isRunning) return

										setIsOpenLeaderboard(true)
									}}
								>
									<p className="block py-0 px-4 m-0 text-base font-normal text-black border-r border-solid border-zinc-100">
										🏆
									</p>
									<div className="flex flex-col flex-1 items-center py-0 px-4 text-black border-r border-solid border-zinc-100">
										<div className="flex flex-grow justify-between w-full text-xs text-black">
											<span className="flex flex-row items-center text-base text-black">
												🥇 {totalLeaderboard ? totalLeaderboard[0]?.username || 'Loading...' : 'Loading...'}
											</span>
											<span className="flex flex-row items-center text-xs font-semibold text-black">
												🥈 {totalLeaderboard ? totalLeaderboard[1]?.username || 'Loading...' : 'Loading...'}
											</span>
											<span className="flex flex-row items-center text-xs text-black">
												🥉 {totalLeaderboard ? totalLeaderboard[2]?.username || 'Loading...' : 'Loading...'}
											</span>
										</div>
									</div>
								</div>
							)
						}
						<ScrollShadow
							className="h-full mt-3 px-3 pb-20"
						>
							<div
								className="flex flex-col gap-2"
							>
								<div
									className="flex flex-col gap-1"
								>
									<p
										className="text-xl"
									>
										Total {unit} of All Time
									</p>
									{
										totalLeaderboard ? totalLeaderboard.map((item, index) => (
											<p
												key={index}
												className="flex justify-between"
											>
												<span>{medalEmoji[index + 1] || `${index + 1}.`} {item.username}</span>
												<span>{numberWithCommas(item.count)} {unit}</span>
											</p>
										)) : 'Loading...'
									}
								</div>
								<div
									className="flex flex-col gap-1"
								>
									<p
										className="text-xl"
									>
										Highest {unit} in {config.second} seconds
									</p>
									{
										highestLeaderboard ?
											highestLeaderboard.map((item, index) => (
												<p
													key={index}
													className="flex justify-between"
												>
													<span>{medalEmoji[index + 1] || `${index + 1}.`} {item.username}</span>
													<span>{numberWithCommas(item.count)} {unit}</span>
												</p>
											)) : 'Loading...'
									}
								</div>
							</div>
						</ScrollShadow>
					</div>
				</motion.div>
			</div>

			<Modal
				isOpen={usernameModal.isOpen}
				onOpenChange={usernameModal.onOpenChange}
				placement='center'
				className="touch-manipulation select-none"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Please enter your name</ModalHeader>
							<ModalBody>
								<p>
									Name can be anything you want to show on the leaderboard.
								</p>
								<Input
									placeholder="Enter your name"
									description="You can change your name after submit but it will not update on the leaderboard."
									isInvalid={!!inputUsernameError}
									errorMessage={inputUsernameError}
									value={inputUsername}
									onChange={(e) => {
										const value = e.target.value.toLowerCase()
										setInputUsername(value)

										if (!value) return setInputUsernameError('Please enter your name.')
										if (value.length > 20) return setInputUsernameError('Name can be maximum 20 characters.')
										if (!/^[a-z0-9 ]*$/.test(value)) return setInputUsernameError('Name can be alphabet and number only.')

										setInputUsernameError('')
									}}
									isRequired
								/>
								<p className="text-sm text-red-500">
									*Bad name can get removed from the leaderboard.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={
									() => {
										if (inputUsernameError) return

										localStorage.setItem('k-username', inputUsername)
										setCount(0)
										setUsername(inputUsername)
										onClose()
									}
								}>
									This is my name!
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			<Modal
				isOpen={MilestoneModal.isOpen}
				onOpenChange={MilestoneModal.onOpenChange}
				placement='center'
				scrollBehavior='outside'
				className="touch-manipulation select-none"
			>
				<ModalContent>
					{(onClose) => {
						return <>
							<ModalHeader className="flex flex-col gap-1">
								{unit} MileStone !
							</ModalHeader>
							<ModalBody>
								<div className="leading-6">
									<div className="px-6 mx-auto max-w-lg">
										<div className="flow-root">
											<ul
												className="p-0 mx-0 mt-0 -mb-7"
											>
												{
													mileStone ?
														mileStone.map((item, index) => {
															const isReached = totalPop >= item.count
															const No = index + 1
															return (
																<li
																	key={index}
																	className="text-left"
																>
																	<div
																		className="relative pb-8"
																	>
																		{
																			No != mileStone.length && (
																				<span
																					className="absolute top-6 left-4 w-px -ml-[0.5px] h-4/5 bg-default-200"
																				/>
																			)
																		}
																		<div
																			className="flex relative"
																		>
																			<div>
																				<span
																					className="flex justify-center items-center w-8 h-8 rounded-full"
																				>
																					{
																						isReached ? (
																							<CheckCircleIcon className="h-12 w-12 text-primary" />
																						) : (
																							<Chip>
																								{No}
																							</Chip>
																						)
																					}
																				</span>
																			</div>
																			<div
																				className="flex flex-1 justify-between pt-1 mr-0 ml-3 min-w-0"
																			>
																				<div>
																					<p
																						className="m-0 text-sm leading-5"
																					>
																						{item.message}
																					</p>
																					{
																						isReached ?
																							item.reward ?
																								item.rewardUrl ? (
																									<a
																										href={item.rewardUrl}
																										target='_blank'
																										className="text-xs leading-5 text-primary flex gap-2 hover:underline"
																									>
																										<LinkIcon className="h-6 w-6 text-primary" />
																										{item.reward}
																									</a>
																								) : (
																									<p
																										className="text-xs leading-5 text-primary"
																									>
																										{item.reward}
																									</p>
																								)
																								: item.rewardUrl ? (
																									<a
																										href={item.rewardUrl}
																										target='_blank'
																										className="text-xs leading-5 text-primary flex gap-2 hover:underline"
																									>
																										<LinkIcon className="h-6 w-6 text-primary" />
																										{item.rewardUrl}
																									</a>
																								) : 'Please wait for the reward.'
																							: null
																					}
																				</div>
																				<Chip
																					color={isReached ? 'primary' : 'default'}
																					className="mr-0 ml-4 text-sm leading-5 text-right whitespace-nowrap"
																				>
																					{numberWithCommas(item.count)} {unit}
																				</Chip>
																			</div>
																		</div>
																	</div>
																</li>
															)
														}) :
														'Loading...'
												}
											</ul>
										</div>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button onPress={onClose}>
									Close
								</Button>
							</ModalFooter>
						</>
					}}
				</ModalContent>
			</Modal>
		</>
	)
}

export default Play
