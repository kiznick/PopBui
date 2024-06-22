import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider, ScrollShadow } from '@nextui-org/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <NextUIProvider className="h-screen">
            <ScrollShadow>
                <div className="flex justify-between p-5">
                    <div className="flex-auto">
                        <img
                            src="./logo/muic.png"
                            alt="Mahidol University International College"
                            className="lg:w-1/3"
                        />
                        <img
                            src="./logo/election.png"
                            alt="Election SMO"
                            className="lg:w-1/6 w-1/2 mt-1"
                        />
                    </div>
                    <div
                        className="flex justify-end"
                    >
                        <img
                            src="./logo/Smogator.png"
                            alt="Smogator"
                            className="lg:w-1/6 w-1/2"
                        />
                    </div>
                </div>
                <App />
                <div
                    className="p-5 text-center w-full"
                >
                    <p>Join us for election</p>
                    <p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
                    <p>Location: Lobby, G Floor, Aditayathorn Building</p>
                </div>
            </ScrollShadow>
        </NextUIProvider>
    </React.StrictMode>,
)
