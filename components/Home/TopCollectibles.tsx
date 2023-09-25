import { BigNumber, ethers } from 'ethers'
import React, { useContext, useEffect, useState } from 'react'
import { CollectiblesMenu, NFTCardItems } from '../../components'
import {
  fetchMarketItems,
  getItems,
  getMarketContract,
  getNumberOfCoinsPublished,
  getCoinInfo,
  getCoinsPerUser,
  MarketContext,
} from '../../context'
import { IItem, ICoin } from '../../interfaces'
import { Loader } from '../common'
import { RPC_URL } from '../../utils/constants'

export const TopCollectibles = () => {
  const [coins, setCoins] = useState<ICoin[] | []>([])
  console.log('coins', coins)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
        const marketContract = await getMarketContract(provider)
        // console.log('marketContract', marketContract)
        // const nftContract = await getNFTContract(provider)
        if (!marketContract) return
        // if (!nftContract) return
        // const [nfts] = await fetchMarketItems({ marketContract: marketContract, offSet: 0, limit: 6, solded: 0 })
        const number = await getNumberOfCoinsPublished(marketContract)
        // console.log('number', number)
        const coinInfo = await getCoinInfo(marketContract, 0)
        // console.log('coinInfo', coinInfo)
        const coinsPerUser = await getCoinsPerUser(marketContract, '0xbc6b93f3Aba28CD04B96c50b0F0ac53a24564718')
        // console.log('coinsPerUsergg', coinsPerUser)

        const parsedCoinPerUserValues = coinsPerUser.map((c: BigNumber) => c.toNumber())
        // console.log('parseCoinPerUserValues', parsedCoinPerUserValues)

        const getCoinPerUserList = await Promise.all(
          parsedCoinPerUserValues.map(async (pc: number) => {
            return await getCoinInfo(marketContract, pc)
          }),
        )
        // console.log('result: ', getCoinPerUserList)
        setCoins(getCoinPerUserList)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    })()
  }, [])

  return isLoading ? (
    <Loader className="relative w-[150px] h-[150px] bg-gradient my-0 mx-auto" size={150} />
  ) : (
    <div className="relative w-[75%] h-[100%] bg-gradient my-0 mx-auto">
      <h2 className="text-white text-center text-[40px] mb-5">Top Monedas</h2>
      <CollectiblesMenu />
      <NFTCardItems items={coins} message="Conecta tu wallet para ver las monedas a la venta" isLoading={isLoading} />
    </div>
  )
}
