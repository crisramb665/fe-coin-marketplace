import { ExternalLinkIcon, XIcon } from '@heroicons/react/solid'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Loader, TransactionProgress } from '../../../components/common'
import { ICoin, ITx, MarketContext, generateCoin, getMarketContract, getCoinInfo } from '../../../context'
import { RPC_URL } from '../../../utils/constants'
import {
  buyCoin,
  confirmShipment,
  confirmReceivement,
  completeThisTrade,
  getCurrentFee,
} from '../../../context/marketContract'

const NFTItem: NextPage = () => {
  const { signer, resetNFTtems, marketContract, getTransactions, txs } = useContext(MarketContext)
  const [coin, setCoin] = useState<ICoin | undefined>(undefined)
  const [fee, setFee] = useState<number>(0)

  const [active, seActive] = useState(1)
  const [fullImage, setFullImage] = useState(false)
  const [txWait, setTxWait] = useState(false)

  const router = useRouter()
  const { id } = router.query
  const idAsNumber = Number(id)

  useEffect(() => {
    if (id) {
      ;(async () => {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
        const marketContract = await getMarketContract(provider)
        const coin = await getCoinInfo(marketContract, idAsNumber)
        const newCoin = await generateCoin(coin, marketContract)
        setCoin(newCoin)
        const fee = await getCurrentFee(marketContract)
        setFee(fee)
        getTransactions()
      })()
    }
  }, [getTransactions, id, idAsNumber])

  const buyCoins = async () => {
    if (!signer) {
      toast.info('Por favor conecta tu wallet!', {
        autoClose: 3000,
      })
      return
    }
    setTxWait(true)
    let toastTx = toast.loading('Por favor espera...', { position: toast.POSITION.BOTTOM_RIGHT })
    const price = ethers.utils.parseUnits(coin!.price as string, 'ether')
    if (!marketContract) return

    const result = await buyCoin(marketContract, Number(coin!.coinId), price)

    if (result) {
      toast.update(toastTx, {
        render: 'Tx Ok',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      resetNFTtems()
    } else {
      setTxWait(false)
      toast.update(toastTx, {
        render: 'TX Fail',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const confirmShipping = async () => {
    if (!signer) {
      toast.info('Por favor conecta tu wallet!', {
        autoClose: 3000,
      })
      return
    }
    setTxWait(true)
    let toastTx = toast.loading('Por favor espera...', { position: toast.POSITION.BOTTOM_RIGHT })
    if (!marketContract) return

    const _txId = txs.find((tx) => tx.coinId === coin?.coinId)?.id as number

    const result = await confirmShipment(marketContract, Number(_txId))

    if (result) {
      toast.update(toastTx, {
        render: 'Tx Ok',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      resetNFTtems()
    } else {
      setTxWait(false)
      toast.update(toastTx, {
        render: 'TX Fail',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const confirmCoinReceivementSuccess = async (wasReceived: boolean) => {
    if (!signer) {
      toast.info('Por favor conecta tu wallet!', {
        autoClose: 3000,
      })
      return
    }
    setTxWait(true)
    let toastTx = toast.loading('Por favor espera...', { position: toast.POSITION.BOTTOM_RIGHT })
    if (!marketContract) return

    const _txId = txs.find((tx) => tx.coinId === coin?.coinId)?.id as number

    const result = await confirmReceivement(marketContract, Number(_txId), wasReceived)

    if (result) {
      toast.update(toastTx, {
        render: 'Tx Ok',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      resetNFTtems()
    } else {
      setTxWait(false)
      toast.update(toastTx, {
        render: 'TX Fail',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const completeTradeProperly = async () => {
    if (!signer) {
      toast.info('Por favor conecta tu wallet!', {
        autoClose: 3000,
      })
      return
    }
    setTxWait(true)
    let toastTx = toast.loading('Por favor espera...', { position: toast.POSITION.BOTTOM_RIGHT })
    if (!marketContract) return

    const _txId = txs.find((tx) => tx.coinId === coin?.coinId)?.id as number

    const result = await completeThisTrade(marketContract, Number(_txId))

    if (result) {
      toast.update(toastTx, {
        render: 'Tx Ok',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      resetNFTtems()
      // router.push('/dashboard')
    } else {
      setTxWait(false)
      toast.update(toastTx, {
        render: 'TX Fail',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const relatedTx = useMemo(() => {
    const tx = txs.find((tx) => tx.coinId === coin?.coinId)
    if (!tx) return {} as ITx
    return tx
  }, [coin, txs])

  const getCommisionCharged = () => {
    const sellerAmount = Number(coin?.price) * (Number(fee) / 100)
    return sellerAmount
  }

  const getReceivedAmount = () => {
    const sellerAmount = getCommisionCharged()
    const commision = Number(coin?.price) - sellerAmount
    return commision
  }

  return (
    <div className="bg-gradient text-white p-5">
      <Head>
        <title>Coin {id && id}</title>
        <meta name="description" content="Coin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!coin ? (
        <Loader className="w-[500px] h-[500px] mx-auto my-0 py-5" size={500} />
      ) : (
        <section className="w-[70%] mx-auto my-0 grid grid-cols-[400px_1fr] items-center justify-center">
          <div className="w-[400px] h-[400px] cursor-pointer hover:opacity-80" onClick={() => setFullImage(true)}></div>
          <div className="self-start justify-center pt-[40px] pl-[50px]">
            <div className="flex flex-row"></div>
            <h2 className="text-3xl py-3">{coin.name}</h2>
            <h2 className="text-4xl py-3">$ {Number(coin.price)} eth</h2>

            <div className="flex items-center justify-start pt-4">
              <ul className="flex flex-row gap-5 text-lg">
                <li
                  className={`cursor-pointer ${active === 1 ? 'border-b-4 border-b-blue-700' : ''}`}
                  onClick={() => seActive(1)}
                >
                  Status
                </li>
                <li
                  className={`cursor-pointer ${active === 2 ? 'border-b-4 border-b-blue-700' : ''}`}
                  onClick={() => seActive(2)}
                >
                  Vendedor
                </li>
              </ul>
            </div>
            {active === 1 ? (
              <div className="pt-3">
                {coin.status === 1 ? (
                  <div>
                    <div className="flex items-center justify-start py-3">
                      <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500">
                        <Image
                          unoptimized
                          src={`https://joesch.moe/api/v1/${relatedTx.buyer}`}
                          alt="avatar"
                          className="rounded-full"
                          layout="responsive"
                          width={40}
                          height={40}
                        />
                      </div>
                      <h4 className="text-xl px-1">
                        <a
                          className=" flex items-center hover:text-blue-500"
                          target="_blank"
                          href={`https://sepolia.etherscan.io//address/${relatedTx.buyer}`}
                          rel="noreferrer"
                        >
                          {' '}
                          <span>Comprador: {relatedTx.buyer}</span> <ExternalLinkIcon className="w-5 h-5" />
                        </a>
                      </h4>
                    </div>

                    {signer && relatedTx.buyer.toLowerCase() === signer.toLowerCase() && relatedTx.status === 0 ? (
                      <div className="flex items-center justify-start py-3">
                        <h4 className="text-xl px-1">Tu vendedor aún no despacha tu moneda</h4>
                      </div>
                    ) : signer && relatedTx.buyer.toLowerCase() === signer.toLowerCase() && relatedTx.status === 1 ? (
                      <div className="flex items-center justify-start py-3">
                        <h4 className="text-xl px-1">Tu moneda está en camino</h4>
                        <button
                          className="bold text-xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-md w-[400px] p-4 cursor-pointer flex justify-center"
                          onClick={() => confirmCoinReceivementSuccess(true)}
                        >
                          {' '}
                          La he recibido
                        </button>
                      </div>
                    ) : (
                      signer &&
                      relatedTx.buyer.toLowerCase() === signer.toLowerCase() &&
                      relatedTx.status === 2 && (
                        <div className="flex items-center justify-start py-3">
                          <h4 className="text-xl px-1">¡Has recibido tu moneda! Que la disfrutes</h4>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div>
                    {coin.status === 1 && <h3>En proceso de venta</h3>}
                    <h3>Has no owner</h3>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-start py-3">
                  <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500">
                    <Image
                      unoptimized
                      src={`https://joesch.moe/api/v1/${coin.seller}`}
                      alt="avatar"
                      className="rounded-full"
                      layout="responsive"
                      width={40}
                      height={40}
                    />
                  </div>
                  <h4 className="text-xl px-5">
                    <a
                      className=" flex items-center hover:text-blue-500"
                      target="_blank"
                      href={`https://sepolia.etherscan.io//address/${coin.seller}`}
                      rel="noreferrer"
                    >
                      {' '}
                      <span>Vendedor: {coin.seller}</span> <ExternalLinkIcon className="w-5 h-5" />
                    </a>
                  </h4>
                </div>

                {signer && relatedTx.seller.toLowerCase() === signer.toLowerCase() && relatedTx.status === 0 ? (
                  <div className="flex items-start justify-start py-3">
                    <h4 className="text-xl px-1">¡Despacha la moneda lo antes posible!</h4>
                    <button
                      className="bold text-xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-md w-[400px] p-4 cursor-pointer flex justify-center"
                      onClick={confirmShipping}
                    >
                      {' '}
                      Confirmar despacho
                    </button>
                  </div>
                ) : signer && relatedTx.seller.toLowerCase() === signer.toLowerCase() && relatedTx.status === 1 ? (
                  <div className="flex items-start justify-start py-3">
                    <h4 className="text-xl px-1">
                      Moneda en camino, espera a que tu comprador confirme que la recibió
                    </h4>
                  </div>
                ) : signer && relatedTx.seller.toLowerCase() === signer.toLowerCase() && relatedTx.status === 2 ? (
                  <div className="flex items-start justify-start py-3">
                    <h4 className="text-xl px-1">¡Tu comprador tiene su moneda!</h4>
                    <button
                      className="bold text-xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-md w-[400px] p-4 cursor-pointer flex justify-center"
                      onClick={completeTradeProperly}
                    >
                      {' '}
                      Culminar venta
                    </button>
                  </div>
                ) : (
                  signer &&
                  relatedTx.seller.toLowerCase() === signer.toLowerCase() &&
                  relatedTx.status === 3 && (
                    <div className="flex flex-col items-start justify-start py-3">
                      <h4 className="text-xl px-1">¡Venta culminada!</h4>
                      <h4 className="text-xl px-1">Recibiste: {getReceivedAmount().toString()} ETH </h4>
                      <h4 className="text-xl px-1">Comisión cobrada: {getCommisionCharged().toString()} ETH </h4>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="py-3 flex flex-col gap-4">
            <Link href={`/coin/${id}/details`}>
              <div className="border-2 border-white rounded-md w-[400px] p-4 cursor-pointer">
                <h4 className="text-center text-xl">Ver detalles</h4>
              </div>
            </Link>
            {coin.status === 0 &&
              coin.seller !== signer &&
              (!txWait ? (
                <button
                  className="bold text-xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-md w-[400px] p-4 cursor-pointer flex justify-center"
                  onClick={buyCoins}
                >
                  Comprar
                </button>
              ) : (
                <TransactionProgress />
              ))}
          </div>

          {fullImage && (
            <div className="w-[100%] h-[100%] bg-[#000000a8] absolute top-0 left-0">
              <div className="w-[800px] h-[800px] absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]">
                <XIcon
                  className="w-10 h-10 absolute right-[-50px] top-0 z-50 cursor-pointer hover:fill-pink-600"
                  onClick={() => setFullImage(false)}
                />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default NFTItem
