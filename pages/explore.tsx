import { NextPage } from 'next'
import { useContext, useEffect, useState, useMemo } from 'react'
import { NFTCardItems } from '../components'
import { Loader } from '../components/common'
import { ICoin, MarketContext } from '../context'
import { ethers, BigNumber, Contract } from 'ethers'
import { RPC_URL } from '../utils/constants'
import { getMarketContract, getNumberOfCoinsPublished, getCoinInfo } from '../context'

const Marketplace: NextPage = () => {
  const { coinFilterItems, getMarketPlaceItems } = useContext(MarketContext)
  const [isLoading, setIsLoading] = useState(false)
  // const [coins, setCoins] = useState<ICoin[] | []>([])

  // const getAllCoins = async (marketContract: Contract, coinIdIndexes: number) => {
  //   try {
  //     const coinPromises = Array.from({ length: Number(coinIdIndexes) }, async (_, i) => {
  //       return await getCoinInfo(marketContract, i)
  //     })
  //     const results = await Promise.all(coinPromises)
  //     return results
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  useEffect(() => {
    showMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showMore = async () => {
    setIsLoading(true)
    getMarketPlaceItems()
    // const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    // const marketContract = await getMarketContract(provider)
    // // console.log('marketContract', marketContract)
    // // const nftContract = await getNFTContract(provider)
    // if (!marketContract) return
    // // if (!nftContract) return
    // // const [nfts] = await fetchMarketItems({ marketContract: marketContract, offSet: 0, limit: 6, solded: 0 })
    // const numCoinsPublished = await getNumberOfCoinsPublished(marketContract)
    // console.log('number', numCoinsPublished)
    // const coinInfo = await getCoinInfo(marketContract, 0)
    // // console.log('coinInfo', coinInfo)

    // const allCoins = (await getAllCoins(marketContract, Number(numCoinsPublished))) ?? ([] as ICoin[])

    // // console.log('all result!!', allCoins)

    // // console.log('result: ', getCoinPerUserList)
    // setCoins(allCoins)
    setIsLoading(false)
  }

  return (
    <section className="bg-gradient text-white py-5">
      <div className="w-[80%] mx-auto my-0">
        <h2 className="text-center text-4xl">Marketplace</h2>
        <NFTCardItems items={coinFilterItems} isLoading={isLoading} />
      </div>
      <div className="flex justify-center items-center">
        {isLoading && <Loader className="w-[150px] h-[150px]" size={150} />}
      </div>
    </section>
  )
}

export default Marketplace
