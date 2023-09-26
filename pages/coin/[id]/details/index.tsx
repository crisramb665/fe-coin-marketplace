import { Signer, ethers } from 'ethers'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { ExternalLinkIcon, XIcon } from '@heroicons/react/solid'
import { Loader, TransactionProgress } from '../../../../components/common'
import { generateCoin, getMarketContract, getCoinInfo, ICoin } from '../../../../context'
import { RPC_URL } from '../../../../utils/constants'
import { DATA_URL } from '../../../../utils'
import { MarketContext } from '../../../../context/marketContext'

const CoinDetails: NextPage = () => {
  const { signer, marketContract } = useContext(MarketContext)
  const [coin, setCoin] = useState<ICoin | undefined>(undefined)
  // console.log('coin awgfasf', coin)
  const [txWait, setTxWait] = useState(false)
  const [fullImage, setFullImage] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const idAsNumber = Number(id)

  const goToEditListing = () => {
    router.push(`/coin/${id}/details/EditListing`)
  }

  const gotToEditFeatures = () => {
    router.push(`/coin/${id}/details/EditFeatures`)
  }

  const getCoinStateOfUse = (status: number): string => {
    switch (status) {
      case 0:
        return 'UNC (Nunca en circulación)'
      case 1:
        return 'XF (Extremadamente bien conservada)'
      case 2:
        return 'VF (Muy bien conservada)'
      case 3:
        return 'F (Bien conservada)'
      case 4:
        return 'G (Decentemente conservada)'
      case 5:
        return 'PR (Pobremente conservada)'
      default:
        return ''
    }
  }

  useEffect(() => {
    if (id) {
      ;(async () => {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
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

  const deleteCoinListing = async () => {
    // const { name, price, supply } = form
    // if (!name || !price || !supply) {
    //   toast.info('Todos los campos son requeridos')
    //   return
    // }

    try {
      deleteCoin()
    } catch (error) {
      console.log(`error eliminando la moneda `, error)
      toast.error('Error al eliminar.')
    }
  }

  const deleteCoin = async () => {
    if (!marketContract) return
    let toastTx = toast.loading('Por favor espera...', {
      position: toast.POSITION.BOTTOM_RIGHT,
    })
    try {
      setTxWait(true)
      

      const _coinId = idAsNumber


      toastTx = toast.loading('Por favor espera...', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      // const transaction = await marketContract.listCoin(_name, _price, _supply, { value: listingFee })
      const transaction = await marketContract.deleteCoinListing(_coinId)

      const tx = await transaction.wait()
      toast.update(toastTx, {
        render: 'Tx Ok',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })

      router.push('/dashboard')
    } catch (error) {
      toast.update(toastTx, {
        render: 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      setTxWait(false)
    }
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
                <span className="bold text-pink-600 text-lg">Material:</span> {coin.features.material}
              </h4>
              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Origen:</span> {coin.features.origin}
              </h4>
              <h4 className="py-3">
                <span className="bold text-pink-600 text-lg">Estado físico:</span>{' '}
                {getCoinStateOfUse(coin.features.stateOfUse)}
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

              {signer && coin.seller.toLowerCase() === signer.toLowerCase() && coin.status === 0 && (
                <div className="flex flex-col items-start">
                  <button
                    className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl w-[200px] p-3 cursor-pointer my-3"
                    onClick={goToEditListing}
                  >
                    Editar listing
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl w-[200px] p-3 cursor-pointer my-3"
                    onClick={gotToEditFeatures}
                  >
                    Editar características
                  </button>
                  {!txWait ? (
                    <button
                      className="bg-gradient-to-r from-[#FF5733] to-[#FF5733] rounded-3xl w-[200px] p-3 cursor-pointer my-3"
                      onClick={deleteCoinListing}
                    >
                      Eliminar publicación
                    </button>
                  ) : (
                    <TransactionProgress />
                  )}
                </div>
              )}
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
