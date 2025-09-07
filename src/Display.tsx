import { ScrollShadow, Progress } from '@nextui-org/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import config from './config'

type LeaderboardType = {
    username: string
    count: number
}

type MileStoneType = {
    count: number
    message: string
}

function Display() {
    const medalEmoji: { [key: number]: string } = {
        1: '🥇',
        2: '🥈',
        3: '🥉',
    }

    const [isPop, setIsPop] = useState(false)
    const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardType[]>([])
    const [highestLeaderboard, setHighestLeaderboard] = useState<LeaderboardType[]>([])
    const [totalPop, setTotalPop] = useState(0)
	const [mileStone, setMileStone] = useState<MileStoneType[]>([])
    const [currentMileStone, setCurrentMileStone] = useState<MileStoneType | null>(null)

    const numberWithCommas = (n: string | number) => {
        return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    useEffect(() => {
        const updateLeaderboard = async () => {
            const response = await axios.get(`${config.apiServer}leaderboard`)

            if (response.data.error) {
                return alert(response.data.message)
            }

            const leaderboard = response.data

            setTotalLeaderboard(leaderboard.totalRanking)
            setHighestLeaderboard(leaderboard.highestRanking)
            setTotalPop(leaderboard.totalPop)
        }

        updateLeaderboard()
        setInterval(() => {
            updateLeaderboard()
        }, 1000 * 2)
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
        setInterval(() => {
            updateMilestone()
        }, 1000 * 5)
    }, [])

    useEffect(() => {
        if (!mileStone) return

        const currentMileStone = mileStone.find((item: MileStoneType) => totalPop < item.count) || null
        setCurrentMileStone(currentMileStone)
    }, [totalPop, mileStone])

    useEffect(() => {
        const randomIsPop = async () => {
            setIsPop(Math.random() < 0.5)

            setTimeout(() => {
                randomIsPop()
            }, 1000 * Math.random())
        }

        randomIsPop()
    }, [])

    return (
        <>
            <div
                className='container mx-auto flex flex-col justify-between'
                style={{
                    backgroundImage: `url('${isPop ? '/2.png' : '/1.png'}')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <div
                    className="py-4 px-5 text-center flex items-center select-none"
                >
                    <div className="mx-auto">
                        <p
                            className="text-7xl lg:text-8xl"
                        >
                            Pop{config.unit}
                        </p>
                        <p>
                            Leaderbboard
                        </p>

                        <div className="flex gap-2 w-[80vw] text-2xl">
                            <div className="w-full h-full overflow-y-none bg-gray-50 rounded-large">
                                <ScrollShadow
                                    className="h-full p-6"
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
                                                Total {config.unit} of All Time
                                            </p>
                                            {
                                                totalLeaderboard ? totalLeaderboard.map((item, index) => (
                                                    <p
                                                        key={index}
                                                        className="flex justify-between"
                                                    >
                                                        <span>{medalEmoji[index + 1] || `${index + 1}.`} {item.username}</span>
                                                        <span>{numberWithCommas(item.count)} {config.unit}</span>
                                                    </p>
                                                )) : 'Loading...'
                                            }
                                        </div>
                                    </div>
                                </ScrollShadow>
                            </div>
                            <div className="w-full h-full overflow-y-none bg-gray-50 rounded-large max-w-5xl">
                                <ScrollShadow
                                    className="h-full p-6"
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
                                                Highest {config.unit} in {config.second} seconds
                                            </p>
                                            {
                                                highestLeaderboard ?
                                                    highestLeaderboard.map((item, index) => (
                                                        <p
                                                            key={index}
                                                            className="flex justify-between"
                                                        >
                                                            <span>{medalEmoji[index + 1] || `${index + 1}.`} {item.username}</span>
                                                            <span>{numberWithCommas(item.count)} {config.unit}</span>
                                                        </p>
                                                    )) : 'Loading...'
                                            }
                                        </div>
                                    </div>
                                </ScrollShadow>
                            </div>
                        </div>
						{
							currentMileStone ? (
								<>
									<Progress
                                        className="mt-2 w-[60vw] mx-auto"
										label={`${currentMileStone.message} if everyone reaches ${numberWithCommas(currentMileStone.count)} ${config.unit}. (${numberWithCommas(totalPop)}/${numberWithCommas(currentMileStone.count)} ${config.unit})`}
										value={totalPop}
										maxValue={currentMileStone.count}
										color={totalPop >= currentMileStone.count ? 'success' : 'primary'}
									/>
								</>
							) : mileStone ? (
								<>
									<Progress
                                        className="mt-2 w-[60vw] mx-auto"
										label={`No more MileStone ;( (${numberWithCommas(totalPop)} ${config.unit})`}
										value={1}
										maxValue={1}
										color={'success'}
									/>
								</>
							) : 'Loading...'
						}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-8 left-8 text-center">
                <p className="mb-2 text-3xl">Scan to Play !</p>
                <img
                    src="./QRCode.png" 
                    alt="pophiw.kiznick.me"
                    className="w-64 h-64 rounded"
                />
            </div>
            <div className="fixed bottom-8 right-8 text-center">
                <p className="mb-2 text-3xl">Scan to Play !</p>
                <img
                    src="./QRCode.png" 
                    alt="pophiw.kiznick.me"
                    className="w-64 h-64 rounded"
                />
            </div>
        </>
    )
}

export default Display
