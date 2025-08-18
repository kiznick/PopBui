import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider, ScrollShadow } from '@nextui-org/react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { Icon } from '@iconify/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const RECAPTCHA_SITE_KEY = '6LfmTv8pAAAAAHD64gDfaGs7_XTch3-EP_L04z03'

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
                            {/* <img
                                src="./logo/election.png"
                                alt="Election SMO"
                                className="lg:w-1/6 w-1/2 mt-1"
                            /> */}
                        </div>
                        {/* <div
                            className="flex justify-start items-center"
                        >
                            <img
                                src="./logo/muic.png"
                                alt="Mahidol University International College"
                                className="lg:w-2/3"
                            />
                        </div> */}
                        <div
                            className="flex justify-end"
                        >
                            <img
                                src="./logo/SmoHoHiw.png"
                                alt="SmoHoHiw"
                                className="lg:w-1/6 w-1/2"
                            />
                        </div>
                    </div>
                    <App />
                    <footer
                        className="text-center w-full mb-16"
                    >
                        <p>© 2025 kiznick All rights reserved.</p>
                        <p className="inline-flex">
                            Made with <Icon icon="solar:heart-bold" width={24} height={24} className="w-5 h-5 mx-1 text-red-500" /> by <a href="https://kiznick.me" target="_blank" rel="noreferrer" className="text-pink-500 dark:text-pink-400 hover:text-pink-400 dark:hover:text-pink-500 hover:underline ml-1">kiznick</a>
                        </p>
                    </footer>
                </GoogleReCaptchaProvider>
            </ScrollShadow>
        </NextUIProvider>
        <ToastContainer
            closeOnClick
            draggable
            newestOnTop
            pauseOnFocusLoss
            pauseOnHover
            autoClose={5000}
            hideProgressBar={false}
            position='bottom-right'
            rtl={false}
            theme="light"
        />
    </React.StrictMode>,
)
