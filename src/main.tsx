import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ReactGA from 'react-ga'
import { NextUIProvider, ScrollShadow } from '@nextui-org/react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const RECAPTCHA_SITE_KEY = '6LfmTv8pAAAAAHD64gDfaGs7_XTch3-EP_L04z03'

ReactGA.initialize('G-TJ93D2EK2Z')

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <NextUIProvider className="h-screen touch-manipulation select-none">
            <ScrollShadow>
                <GoogleReCaptchaProvider
                    reCaptchaKey={RECAPTCHA_SITE_KEY}
                >
                    <div className="flex justify-between p-5 pb-0">
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
                        className="text-center w-full mb-16"
                    >
                        <p>Join us for election</p>
                        <p>Date: 3-4 July 2024 Time: 10:00-16:00</p>
                        <p>Location: Lobby, G Floor, Aditayathorn Building</p>
                    </div>
                </GoogleReCaptchaProvider>
            </ScrollShadow>
        </NextUIProvider>
    </React.StrictMode>,
)
