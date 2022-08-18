import Head from "next/head"
import { Header } from "../components/Header"
import { RaffleEntrance } from "../components/RaffleEntrance"
//types
import type { NextPage } from "next"

//styles
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Smart Contract Raffle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* Header / Connect button*/}
            <Header />
            {/* Raffle */}
            <RaffleEntrance />
        </div>
    )
}

export default Home
