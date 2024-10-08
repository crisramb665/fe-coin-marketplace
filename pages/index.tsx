import type { NextPage } from 'next'
import Head from 'next/head'
import { Hero } from '../components/Home/Hero'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Marketplace</title>
        <meta name="description" content="Coin Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
    </div>
  )
}

export default Home
