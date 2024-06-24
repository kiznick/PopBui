import { Button, ScrollShadow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Progress, Chip } from '@nextui-org/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type LeaderboardType = {
	username: string
	buiCount: number
}

type MileStoneType = {
	buiCount: number
	message: string
}

function Play() {
	const time = 5

	const apiServer = 'https://popbui-api.kiznick.me/'
	// const apiServer = 'http://localhost:3000/'

	const maxClick = 25 * time

	const medalEmoji: { [key: number]: string } = {
		1: '🥇',
		2: '🥈',
		3: '🥉',
	}

	const usernameModal = useDisclosure()
	const buiMilestoneModal = useDisclosure()
	const { executeRecaptcha } = useGoogleReCaptcha()

	const [isClicked, setIsClicked] = useState(false)
	const [count, setCount] = useState(0)
	const [timeLeft, setTimeLeft] = useState(time)
	const [isRunning, setIsRunning] = useState(false)
	const [isLockButton, setIsLockButton] = useState(false)
	const [isOpenLeaderboard, setIsOpenLeaderboard] = useState(false)
	const [username, setUsername] = useState('')
	const [inputUsernameError, setInputUsernameError] = useState('')
	const [inputUsername, setInputUsername] = useState('')
	const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardType[]>([])
	const [highestLeaderboard, setHighestLeaderboard] = useState<LeaderboardType[]>([])
	const [totalBui, setTotalBui] = useState(0)
	const [mileStone, setMileStone] = useState<MileStoneType[]>([])
	const [currentMileStone, setCurrentMileStone] = useState<MileStoneType | null>(null)

	const numberWithCommas = (n: string | number) => {
		return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	useEffect(() => {
		const sendData = async () => {
			if (!executeRecaptcha) return alert('Recaptcha not ready yet.')

			if (count === 0) return
			if (count > maxClick) return alert('You clicked too much.')

			const token = await executeRecaptcha('kiznick')
			const response = await axios.post(`${apiServer}kiznick`, {
				token,
				username,
				buiCount: count,
			})

			if (response.data.error) {
				alert(response.data.message)
			}
		}

		if (!isRunning && count > 0 && username) {
			sendData()
		}
	}, [count, executeRecaptcha, isRunning, maxClick, username])

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
			}, 1000)
		}

		return () => {
			clearInterval(intervalId)
		}
	}, [isRunning, timeLeft])

	useEffect(() => {
		const updateLeaderboard = async () => {
			const response = await axios.get(`${apiServer}leaderboard`)

			if (response.data.error) {
				return alert(response.data.message)
			}

			const leaderboard = response.data

			setTotalLeaderboard(leaderboard.totalRanking)
			setHighestLeaderboard(leaderboard.highestRanking)
			setTotalBui(leaderboard.totalBui)
		}

		updateLeaderboard()
		setInterval(() => {
			updateLeaderboard()
		}, 1000 * 2)
	}, [])

	useEffect(() => {
		const updateMilestone = async () => {
			const response = await axios.get(`${apiServer}milestone`)

			if (response.data.error) {
				return alert(response.data.message)
			}

			setMileStone(response.data)
		}

		updateMilestone()
		setInterval(() => {
			updateMilestone()
		}, 1000 * 5)
	}, [])

	useEffect(() => {
		if(!mileStone) return

		const currentMileStone = mileStone.find((item: MileStoneType) => totalBui < item.buiCount) || null
		setCurrentMileStone(currentMileStone)
	}, [totalBui, mileStone])

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

		const handleMouseDown = () => {
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

		return () => {
			window.removeEventListener('pointerdown', handleMouseDown)
			window.removeEventListener('pointerup', handleMouseUp)
		}
	}, [isClicked, isRunning])

	return (
		<>
			<div
				className='container mx-auto flex flex-col justify-between'
				// style={{
				// 	backgroundImage: `url('${isClicked ? '/2.png' : '/1.png'}')`,
				// 	backgroundSize: 'contain',
				// 	backgroundRepeat: 'no-repeat',
				// 	backgroundPosition: 'center',
				// }}
			>
				<div
					className="py-4 px-5 text-center flex items-center select-none"
				>
					<div className="mx-auto">
						<p
							className="text-7xl lg:text-8xl"
						>
							PopBui
						</p>
						<p>
							Click as much as you can in {time} seconds.
						</p>
						{/* <p
							className='text-4xl lg:text-5xl mt-2'
						>
							Timeleft: <span className="font-bold">{timeLeft}</span>s
						</p>
						<p
							className='text-4xl lg:text-5xl'
						>
							<span className="font-bold">{count}</span> Bui
						</p> */}
						<p
							className='text-4xl lg:text-5xl'
						>
							<span className="font-bold">{timeLeft}</span>s | <span className="font-bold">{count}</span> Bui
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
												setUsername('')
											}}
										>
											<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
												<path d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
											</svg>
										</div>
									</>
								) : (
									<>
										Please click Start button to enter your name !
									</>
								)
							}
						</p>
						<Button
							className='mt-5'
							disabled={isLockButton}
							onClick={() => {
								if (isLockButton) return

								if (!username) {
									setInputUsername('')
									return usernameModal.onOpen()
								}

								if (!executeRecaptcha) {
									return alert('Recaptcha not ready yet.')
								}

								setCount(0)
								setTimeLeft(time)
								setIsRunning(true)
								setIsLockButton(true)
							}}
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
										label={`${currentMileStone.message} if everyone reaches ${numberWithCommas(currentMileStone.buiCount)} Bui. (${numberWithCommas(totalBui)}/${numberWithCommas(currentMileStone.buiCount)} Bui)`}
										value={totalBui}
										maxValue={currentMileStone.buiCount}
										color={totalBui >= currentMileStone.buiCount ? 'success' : 'primary'}
										onClick={buiMilestoneModal.onOpen}
									/>
									<p
										className="mt-2"
										onClick={buiMilestoneModal.onOpen}
									>
										Click me to view more MileStone !
									</p>
								</>
							) : null
						}
					</div>
				</div>
				<motion.div
					className={`fixed bottom-0 left-0 z-40 w-screen flex items-center justify-center`}
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
						onClick={() => {
							setIsOpenLeaderboard((prev) => !prev)
						}}
					>
						{
							isOpenLeaderboard ? (
								<p className="px-3 pt-4 text-3xl">
									Leaderboard
								</p>
							) : (
								<div className="flex flex-row py-4 px-0 text-black cursor-pointer">
									<p className="block py-0 px-4 m-0 text-base font-normal text-black border-r border-solid cursor-pointer border-zinc-100">
										🏆
									</p>
									<div className="flex flex-col flex-1 items-center py-0 px-4 text-black border-r border-solid cursor-pointer border-zinc-100">
										<div className="flex flex-grow justify-between w-full text-xs text-black cursor-pointer">
											<span className="flex flex-row items-center text-base text-black cursor-pointer">
												🥇 {totalLeaderboard ? totalLeaderboard[0]?.username || 'Loading...' : 'Loading...'}
											</span>
											<span className="flex flex-row items-center text-xs font-semibold text-black cursor-pointer">
												🥈 {totalLeaderboard ? totalLeaderboard[1]?.username || 'Loading...' : 'Loading...'}
											</span>
											<span className="flex flex-row items-center text-xs text-black cursor-pointer">
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
										Total Ranking
									</p>
									{
										totalLeaderboard ? totalLeaderboard.map((item, index) => (
											<p
												key={index}
												className="flex justify-between"
											>
												<span>{medalEmoji[index + 1] || `${index + 1}.`} {item.username}</span>
												<span>{numberWithCommas(item.buiCount)} Bui</span>
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
										Highest Ranking
									</p>
									{
										highestLeaderboard ?
											highestLeaderboard.map((item, index) => (
												<p
													key={index}
													className="flex justify-between"
												>
													<span>{medalEmoji[index + 1] || `${index + 1}.`} {item.username}</span>
													<span>{numberWithCommas(item.buiCount)} Bui</span>
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
				isOpen={buiMilestoneModal.isOpen}
				onOpenChange={buiMilestoneModal.onOpenChange}
			>
				<ModalContent>
					{(onClose) => {
						return <>
							<ModalHeader className="flex flex-col gap-1">
								Bui MileStone !
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
															const isReached = totalBui >= item.buiCount
															const No = index + 1
															return (
																<li className="text-left">
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
																					{/*
																					<p
																						className="m-0 text-xs leading-5 text-default-500"
																					>
																						Description
																					</p>
																					*/}
																				</div>
																				<Chip
																					color={isReached ? 'primary' : 'default'}
																					className="mr-0 ml-4 text-sm leading-5 text-right whitespace-nowrap"
																				>
																					{numberWithCommas(item.buiCount)} Bui
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
