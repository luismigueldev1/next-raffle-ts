import React, { FC, useEffect } from "react"
import { useMoralis } from "react-moralis"
import { OnAccountChanged } from "react-moralis/lib/hooks/core/useMoralis/_useMoralisAuth"

export const ManualHeader: FC = () => {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3
            }
        }
        enableWeb3()
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account: OnAccountChanged) => {
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    //handlers
    const handleConnect = async () => {
        await enableWeb3()
        if (typeof window !== "undefined") {
            window.localStorage.setItem("connected", "injected")
        }
    }

    return (
        <div>
            {account ? (
                <h2>
                    Connected to: {account.slice(0, 6)}
                    ...
                    {account.slice(account.length - 4)}
                </h2>
            ) : (
                <button onClick={handleConnect} disabled={isWeb3EnableLoading}>
                    Connect
                </button>
            )}
        </div>
    )
}
