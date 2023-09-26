import { ethers, Contract } from 'ethers'
import React, { useEffect, useState } from 'react'
import { CollectiblesMenu, NFTCardItems } from '../../components'
import { getMarketContract, getNumberOfCoinsPublished, getCoinInfo } from '../../context'
import { ICoin } from '../../interfaces'
import { Loader } from '../common'
import { RPC_URL } from '../../utils/constants'

export const TopCollectibles = () => {
  const [coins, setCoins] = useState<ICoin[] | []>([])
  const [isLoading, setIsLoading] = useState(false)

  const getAllCoins = async (marketContract: Contract, coinIdIndexes: number) => {
    try {
      const coinPromises = Array.from({ length: Number(coinIdIndexes) }, async (_, i) => {
        return await getCoinInfo(marketContract, i)
      })
      const results = await Promise.all(coinPromises)
      return results
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
        const marketContract = await getMarketContract(provider)

        if (!marketContract) return
        const numCoinsPublished = await getNumberOfCoinsPublished(marketContract)

        const allCoins = (await getAllCoins(marketContract, Number(numCoinsPublished))) ?? ([] as ICoin[])
        const filterActiveCoins = allCoins.filter((coin: ICoin) => coin.status === 0)

        setCoins(filterActiveCoins)
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
