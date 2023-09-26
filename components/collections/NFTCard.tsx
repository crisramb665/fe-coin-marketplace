import { FC } from 'react'

import { ICoin } from '../../interfaces'
import { shortenAddress } from '../../utils'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

export const NFTCard: FC<ICoin> = (item: ICoin) => {
  const { coinId, name, price, seller } = item

  const id = coinId
  const router = useRouter()

  const goTo = () => {
    router.push(`/coin/${id}`)
  }

  return (
    <div
      className="bg-white h-[600px] w-[350px] flex flex-col rounded-2xl cursor-pointer hover:opacity-[0.9]"
      onClick={goTo}
    >
      <div className="w-[350px] h-[350px]"></div>
      <div className="text-[#444] h-[250px] w-[350px] p-4 relative">
        <h4 className="px-1 py-2 text-3xl bold">{name}</h4>
        {/* <h4 className="px-1 py-3 text-2xl">$ {Number(price)} eth</h4> */}
        <h4 className="px-1 py-3 text-2xl">$ {ethers.utils.formatUnits(price, 'ether')} eth</h4>
        <div className="flex items-center justify-start py-3">
          <h4 className="px-1 py-2 text-xl bold">Vendedor: </h4>
          <h4 className="text-xl px-1">{shortenAddress(seller.toLowerCase())}</h4>
        </div>
      </div>
    </div>
  )
}
