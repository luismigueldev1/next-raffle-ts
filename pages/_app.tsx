import { NotificationProvider } from "@web3uikit/core"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"

import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
