import { Button } from '@nextui-org/react'
// import clsx from 'clsx'
// import axios from 'axios'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
// import { DotLottiePlayer } from '@dotlottie/react-player'
import '@dotlottie/react-player/dist/index.css'

// Start 20.50

function App() {
	const time = 3

	const popSound = new Audio('/pop.mp3')

	const [isClicked, setIsClicked] = useState(false)
	const [count, setCount] = useState(0)
	const [timeLeft, setTimeLeft] = useState(time)
	const [isRunning, setIsRunning] = useState(false)

	useEffect(() => {
		let intervalId = undefined

		if (isRunning && timeLeft > 0) {
			intervalId = setInterval(() => {
				setTimeLeft(timeLeft - 1)
			}, 1000)
		} else if (timeLeft <= 0) {
			console.log('Time out')
			setIsRunning(() => false)
		}

		return () => {
			clearInterval(intervalId)
		}
	}, [isRunning, timeLeft])

	const handleMouseDown = () => {
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
		<>
			{/* <motion.div
				className="bg-[#B32425] h-screen w-screen fixed top-0 left-0 z-20 flex items-center"
				animate={{
					scale: isZoom ? 1 : 0,
				}}
			>
				<img
					src="./logo/Smogator.png"
					alt="Bui Bui Wink at You"
					className="w-1/3 mx-auto"
				/>
			</motion.div> */}
			<div
				className="py-10 px-5 text-center flex items-center"
				onPointerDown={handleMouseDown}
				onPointerUp={handleMouseUp}
			>
				<div className="mx-auto">
					<p
						className="text-8xl"
					>
						PopBui
					</p>
					<p>
						Click as much as you can in 20 seconds.
					</p>
					{/* <p>
						Time left: <span className="font-bold">{timeLeft}</span>s | Pop: <span className="font-bold">{count}</span>
					</p> */}
					<p
						className='text-5xl'
					>
						Timeleft: <span className="font-bold">{timeLeft}</span>s
					</p>
					<p
						className='text-5xl'
					>
						Pop: <span className="font-bold">{count}</span>
					</p>
					<Button
						className='mt-5'
						onClick={() => {
							setCount(0)
							setTimeLeft(time)
							setIsRunning(true)
						}}
						style={{
							visibility: isRunning ? 'hidden' : 'visible',
						}}
					>
						Start
					</Button>
					<motion.div
						className="m-10"
						// whileHover={{ scale: isZoom ? 150 : 1.1 }}
						// whileTap={{ scale: isZoom ? 150 : 0.9 }}
						// animate={{ scale: isZoom ? 150 : 1 }}
						// whileHover={{ scale: 1.1 }}
						// whileTap={{ scale: 0.9 }}
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
		</>
	)
}

export default App
