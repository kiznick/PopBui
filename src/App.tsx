import { useEffect, useState } from 'react'
import Play from './Play'
import Display from './Display'

type Page = 'loading' | 'display' | 'play'

function App() {
    const [page, setPage] = useState<Page>('loading')

    useEffect(() => {
        if (window.location.pathname == '/display') {
            setPage('display')
        } else {
            setPage('play')
        }
    }, [])


    if (page == 'play') {
        return <Play />
    } else if (page == 'display') {
        return <Display />
    } else if (page == 'loading') {
        return (
            <div
                className="flex items-center justify-center py-48"
            >
                <div
                    className="text-3xl text-center"
                >
                    Loading...
                </div>
            </div>
        )
    } else {
        return (
            <div
                className="flex items-center justify-center py-48"
            >
                <div
                    className="text-3xl text-center"
                >
                    Unknown Error.
                </div>
            </div>
        )
    }
}

export default App