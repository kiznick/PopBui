import { Button, ScrollShadow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from '@nextui-org/react'
// import clsx from 'clsx'
import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
// import { DotLottiePlayer } from '@dotlottie/react-player'
// import '@dotlottie/react-player/dist/index.css'
import { Howl } from 'howler'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'


function App() {
	const time = 3
	const RECAPTCHA_SITE_KEY = '6LfmTv8pAAAAAHD64gDfaGs7_XTch3-EP_L04z03'

	const apiServer = 'https://popbui-api.kiznick.me/'

	const maxClick = 15 * time
	const popSound = new Howl({
		src: ['/pop.mp3'],
		volume: 1
	})

	const usernameModal = useDisclosure()
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

	const sendData = useCallback(async () => {
		if (!executeRecaptcha) return

		const token = await executeRecaptcha('submit')
		const response = await axios.post(`${apiServer}submit`, {
			token,
			username,
			popCount: count,
		})

		if (response.data.error) {
			alert(response.data.message)
		}
	})

	useEffect(() => {
		let intervalId = undefined

		if (isRunning && timeLeft > 0) {
			intervalId = setInterval(() => {
				setTimeLeft(timeLeft - 1)
			}, 1000)
		} else if (isRunning && timeLeft <= 0) {
			sendData()
			setIsRunning(() => false)
			setTimeout(() => {
				setIsLockButton(() => false)
			}, 1000)
		}

		return () => {
			clearInterval(intervalId)
		}
	}, [isRunning, sendData, timeLeft])

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

	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={RECAPTCHA_SITE_KEY}
		>
			<div
				className='container mx-auto h-screen flex flex-col justify-between'
			>
				<div
					className="py-10 px-5 text-center flex items-center select-none"
					onPointerDown={handleMouseDown}
					onPointerUp={handleMouseUp}
				>
					<div className="mx-auto pointer-events-none">
						<p
							className="text-7xl lg:text-8xl"
						>
							PopBui
						</p>
						<p>
							Click as much as you can in {time} seconds.
						</p>
						<p
							className='text-4xl lg:text-5xl mt-2'
						>
							Timeleft: <span className="font-bold">{timeLeft}</span>s
						</p>
						<p
							className='text-4xl lg:text-5xl'
						>
							Pop: <span className="font-bold">{count}</span>
						</p>
						<p
							className='text-xl flex items-center justify-center gap-2 mt-5 pointer-events-none'
						>
							{
								username ? (
									<>
										Welcome, {username}
										<div
											className="h-8 w-8 pointer-events-auto"
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
							className='mt-5 pointer-events-auto'
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
						<motion.div
							className="m-10"
							animate={{ scale: isClicked ? 1.2 : 1 }}
						>
							{/* <DotLottiePlayer
							src="https://lottie.host/3c5001b6-7cd0-4fce-bcdc-05b2c4b73078/Yj6LV4QIRD.lottie"
							loop
							autoplay
							className="mt-10 w-1/3 mx-auto cursor-pointer"
							speed={isClicked ? 10 : 1}
							onClick={() => {
								if (isClicked) return
								setIsClicked(true)

								setTimeout(() => {
									setIsZoom(true)
								}, 1500)

								setTimeout(() => {
									const randomNumber = Math.floor(Math.random() * 9) + 1
									setMessageNumber(randomNumber)
									setIsZoom(false)
									setIsZoomOut(true)
									window.history.pushState(null, '', `/${randomNumber}`)
								}, 2000)
							}}
						/> */}
							<img
								className="mx-auto w-1/2"
								src={isClicked ? '/2.png' : '/1.png'}
								alt="PopBui"
							/>
						</motion.div>
						{/* <p
						className="text-5xl"
					>
						Start click !
					</p> */}
					</div>
				</div>
				{/* -translate-y-full sm:translate-y-0 */}
				<motion.div
					className={`fixed bottom-0 z-40 w-screen max-w-3xl`}
					style={{
						margin: '0 auto',
						height: '3.5rem',
					}}
					animate={{
						height: isOpenLeaderboard ? '50vh' : '3.5rem',
					}}
				>
					<div
						className="w-full h-full px-3 py-4 overflow-y-none bg-gray-50 rounded-t-large pointer-events-auto"
						onClick={() => {
							setIsOpenLeaderboard((prev) => !prev)
						}}
					>
						{
							isOpenLeaderboard ? 'Leaderboard' : 'Show Leaderboard'
						}
						<ScrollShadow
							className="h-full mt-3"
							style={{
								// visibility: isOpenLeaderboard ? 'visible' : 'hidden',
							}}
						>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
							<p>Join us for election</p>
							<p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
							<p>Location: Lobby, G Floor, Aditayathorn Building</p>
						</ScrollShadow>
					</div>
				</motion.div>
			</div>
			<Modal isOpen={usernameModal.isOpen} onOpenChange={usernameModal.onOpenChange}>
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
										const value = e.target.value
										setInputUsername(value)

										if (!value) return setInputUsernameError('Please enter your name.')
										if (value.length > 20) return setInputUsernameError('Name can be maximum 20 characters.')
										if (!/^[a-zA-Z0-9 ]*$/.test(value)) return setInputUsernameError('Name can be alphabet and number only.')

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
		</GoogleReCaptchaProvider>
	)
}

export default App
