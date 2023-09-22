import { FC } from 'react'
import Image from 'next/image'
import { IItem } from '../../interfaces'
import { DATA_URL_DARK, shortenAddress } from '../../utils'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

export const NFTCard: FC<IItem> = (item) => {
  const { image, price, name, seller, itemId } = item
  const id = ethers.BigNumber.from(itemId).toNumber()
  const router = useRouter()

  const goTo = () => {
    router.push(`/nft/${id}`)
  }

  return (
    <div
      className="bg-white h-[600px] w-[350px] flex flex-col rounded-2xl cursor-pointer hover:opacity-[0.9]"
      onClick={goTo}
    >
      <div className="w-[350px] h-[350px]">
        <Image
          unoptimized
          src={image}
          alt="Picture of the author"
          className="rounded-t-2xl mt-4"
          layout="responsive"
          width={350}
          height={350}
          blurDataURL={DATA_URL_DARK}
          placeholder="blur"
        />
      </div>
      <div className="text-[#444] h-[250px] w-[350px] p-4 relative">
        <h4 className="px-1 py-2 text-3xl bold">{name}</h4>
        <h4 className="px-1 py-3 text-2xl">$ {price} eth</h4>
        <div className="flex items-center justify-start py-3">
          <h4 className="px-1 py-2 text-xl bold">Vendedor: </h4>
          <h4 className="text-xl px-1">{shortenAddress(seller)}</h4>
        </div>
      </div>
    </div>
  )
}
