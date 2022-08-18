import { useNotification } from "@web3uikit/core"
import { Bell } from "@web3uikit/icons"
import { BigNumber, ContractTransaction, ethers } from "ethers"
import React, { FC, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"

//contants
import { abi, contractAddresses } from "../constants"

interface contractAddressesInterface {
    [key: string]: string[]
}

export const RaffleEntrance: FC = () => {
    //State
    const [entranceFee, setEntranceFee] = useState<string>("0")
    const [numberPlayers, setNumberPlayers] = useState<string>("0")
    const [recentWinner, setRecentWinner] = useState<string>("0")

    //Hooks
    const dispatch = useNotification()
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()

    const addresses: contractAddressesInterface = contractAddresses
    const chainId: number = parseInt(chainIdHex!)
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null

    /*
     *Contract Interactions
     */

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress!,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress!,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress!,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress!,
        functionName: "getRecentWinner",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const updateUI = async () => {
        const entranceFeeFromContract = (
            (await getEntranceFee()) as BigNumber
        ).toString()
        const numberPlayersFromContract = (
            (await getNumberOfPlayers()) as BigNumber
        ).toString()
        const recentWinnerFromContract = (
            (await getRecentWinner()) as BigNumber
        ).toString()

        setEntranceFee(entranceFeeFromContract)
        setNumberPlayers(numberPlayersFromContract)
        setRecentWinner(recentWinnerFromContract)
    }

    /*
     *Handlers
     */
    const handleOnSuccess = async (tx: ContractTransaction) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = (tx: ContractTransaction) => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: <Bell fontSize={20} />,
        })
    }
    const handleError = (error: Error) => {
        dispatch({
            type: "warning",
            message: "Transaction Rejected",
            title: "Tx Notification",
            position: "topR",
            icon: <Bell fontSize={20} />,
        })
    }

    const handleRaffleEnter = async () => {
        await enterRaffle({
            onSuccess: (tx) => handleOnSuccess(tx as ContractTransaction),
            onError: (error: Error) => handleError(error),
        })
    }

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <p>
                        Raffle entrance fee:{" "}
                        {ethers.utils.formatUnits(entranceFee!, "ether")} ETH
                    </p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-35"
                        onClick={handleRaffleEnter}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-4 w-4 border-b-2 rounded-full "></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <p>Number of Players: {numberPlayers}</p>
                    <p>Recent Winner: {recentWinner}</p>
                </div>
            ) : (
                <div>
                    {" "}
                    <p> No Raffle Address Detected</p>{" "}
                </div>
            )}
        </div>
    )
}
