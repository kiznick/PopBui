import { ScrollShadow, Progress } from '@nextui-org/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

type LeaderboardType = {
    username: string
    buiCount: number
}

type MileStoneType = {
    buiCount: number
    message: string
}

function Display() {
    const apiServer = 'https://popbui-api.kiznick.me/'

    const medalEmoji: { [key: number]: string } = {
        1: '🥇',
        2: '🥈',
        3: '🥉',
    }

    const [isBui, setIsBui] = useState(false)
    const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardType[]>([])
    const [highestLeaderboard, setHighestLeaderboard] = useState<LeaderboardType[]>([])
    const [totalBui, setTotalBui] = useState(0)
	const [mileStone, setMileStone] = useState<MileStoneType[]>([])
    const [currentMileStone, setCurrentMileStone] = useState<MileStoneType | null>(null)

    const numberWithCommas = (n: string | number) => {
        return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

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
        if (!mileStone) return

        const currentMileStone = mileStone.find((item: MileStoneType) => totalBui < item.buiCount) || null
        setCurrentMileStone(currentMileStone)
    }, [totalBui, mileStone])

    useEffect(() => {
        const randomIsBui = async () => {
            setIsBui(Math.random() < 0.5)

            setTimeout(() => {
                randomIsBui()
            }, 1000 * Math.random())
        }

        randomIsBui()
    }, [])

    return (
        <>
            <div
                className='container mx-auto flex flex-col justify-between'
                style={{
                    backgroundImage: `url('${isBui ? '/2.png' : '/1.png'}')`,
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
                            PopBui
                        </p>
                        <p>
                            Leaderbboard
                        </p>

                        <div className="flex gap-2">
                            <div className="w-full h-full overflow-y-none bg-gray-50 rounded-large max-w-3xl">
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
                                    </div>
                                </ScrollShadow>
                            </div>
                            <div className="w-full h-full overflow-y-none bg-gray-50 rounded-large max-w-3xl">
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
                        </div>

                        {
                            currentMileStone ? (
                                <Progress
                                    className="mt-2"
                                    label={`${currentMileStone.message} if everyone reaches ${numberWithCommas(currentMileStone.buiCount)} Bui. (${numberWithCommas(totalBui)}/${numberWithCommas(currentMileStone.buiCount)} Bui)`}
                                    value={totalBui}
                                    maxValue={currentMileStone.buiCount}
                                    color={totalBui >= currentMileStone.buiCount ? 'success' : 'primary'}
                                />
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Display
