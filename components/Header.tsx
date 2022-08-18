import { FC } from "react"
import { ConnectButton } from "@web3uikit/web3"

export const Header: FC = () => {
    return (
        <div className="border-b-2 p-5 flex flex-row justify-between ">
            <h1 className="text-2xl font-semibold">Decentralized Raffle</h1>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
