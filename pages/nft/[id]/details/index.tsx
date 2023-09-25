import { ethers } from 'ethers'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ExternalLinkIcon, XIcon } from '@heroicons/react/solid'
import { Loader } from '../../../../components/common'
import { generateCoin, getMarketContract, getCoinInfo, ICoin } from '../../../../context'
import { DATA_URL } from '../../../../utils'

const CoinDetails: NextPage = () => {
  const [coin, setCoin] = useState<ICoin | undefined>(undefined)
  const [fullImage, setFullImage] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const idAsNumber = Number(id)

  useEffect(() => {
    if (id) {
      ;(async () => {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_VERCEL_RPC_URL)
        const marketContract = await getMarketContract(provider)
        // const nftContract = await getNFTContract(provider)
        // const coin = await marketContract.getItemById(parseInt(id as string))
        const coin = await getCoinInfo(marketContract, idAsNumber)
        const newCoin = await generateCoin(coin, marketContract)
        setCoin(newCoin)
      })()
    }
  }, [id, idAsNumber])

  const getFormatDate = (unformatDate: string): string => {
    const date = new Date(parseInt(unformatDate) * 1000)
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  return (
    <div className="bg-gradient text-white p-5">
      <Head>
        <title>Detalles de la moneda {id && id}</title>
        <meta name="description" content="NFT Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!coin ? (
        <Loader className="w-[500px] h-[500px] mx-auto my-0 py-5" size={500} />
      ) : (
        <section className="w-[80%] mx-auto my-0">
          <h2 className="bold text-blue-600 text-4xl text-center">Detalles de la moneda</h2>
          <div className="grid grid-cols-[1fr_350px] gap-[20px] justify-center items-center">
            <div>
              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">ID:</span> {ethers.BigNumber.from(coin.coinId).toNumber()}
              </h4>
              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Nombre:</span> {coin.name}
              </h4>
              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Precio:</span> {Number(coin.price)} eth
              </h4>
              <h4 className="py-3 flex items-center">
                <span className="bold text-pink-600 text-lg pr-2">Vendedor:</span>
                <a
                  className="text-blue-500 flex"
                  target="_blank"
                  href={`https://sepolia.etherscan.io/address/${coin.seller}`}
                  rel="noreferrer"
                >
                  {' '}
                  <span>{coin.seller}</span> <ExternalLinkIcon className="w-5 h-5" />
                </a>
              </h4>
              {/* <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Fecha de publicación:</span> {getFormatDate(coin.createAt)}
              </h4> */}
              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Año de acuñación:</span> {coin.features.mintingYear}
              </h4>
              {/* <h4 className="py-3 flex items-center">
                <span className="bold text-pink-600 text-lg pr-2">Owner:</span>
                {coin.sold ? (
                  <a
                    className="text-blue-500 flex"
                    target="_blank"
                    href={`https://sepolia.etherscan.io/address/${coin.owner}`}
                    rel="noreferrer"
                  >
                    {' '}
                    <span>{coin.owner}</span> <ExternalLinkIcon className="w-5 h-5" />
                  </a>
                ) : (
                  <>{coin.owner}</>
                )}
              </h4> */}

              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Material:</span> {coin.status === 0 ? 'Disponible' : 'Vendida'}
              </h4>
              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Origen:</span>{' '}
                {ethers.BigNumber.from(coin.coinId).toNumber()}
              </h4>
              {/* <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Estado Físico:</span>{' '}
                <a className="text-blue-500" target="_blank" href={coin.image} rel="noreferrer">
                  {coin.image}
                </a>
              </h4> */}
              {/* <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Status:</span>{' '}
                <a className="text-blue-500" target="_blank" href={coin.image} rel="noreferrer">
                  {coin.image}
                </a>
              </h4> */}
            </div>
            <div className="flex flex-col ">
              {/* <div className="w-[350px] h-[350px] cursor-pointer hover:opacity-80" onClick={() => setFullImage(true)}>
                <Image
                  unoptimized
                  src={coin!.image}
                  alt="Picture of the author"
                  className="rounded-2xl mt-4"
                  layout="responsive"
                  width={350}
                  height={350}
                  blurDataURL={DATA_URL}
                  placeholder="blur"
                />
              </div> */}
              <Link href={`/coin/${id}`}>
                <div className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl w-[300px] p-3 cursor-pointer mx-auto my-3">
                  <h4 className="text-center text-xl">Ver en marketplace</h4>
                </div>
              </Link>
            </div>
          </div>
          {/* {fullImage && (
            <div className="w-[100%] h-[100%] bg-[#000000a8] absolute top-0 left-0">
              <div className="w-[800px] h-[800px] absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]">
                <XIcon
                  className="w-10 h-10 absolute right-[-50px] top-0 z-50 cursor-pointer hover:fill-pink-600"
                  onClick={() => setFullImage(false)}
                />
                <Image
                  unoptimized
                  src={coin!.image}
                  alt="Picture of the author"
                  className="rounded-2xl mt-4"
                  layout="responsive"
                  width={800}
                  height={800}
                  blurDataURL={DATA_URL}
                  placeholder="blur"
                />
              </div>
            </div>
          )} */}
        </section>
      )}
    </div>
  )
}

export default CoinDetails
