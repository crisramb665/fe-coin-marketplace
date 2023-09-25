import { ethers } from 'ethers'
import type { NextPage } from 'next'
import Head from 'next/head'
import { FC, useContext, useEffect, useState } from 'react'
import { getItems, getNFTBySeller, getSoldNFT, IItem, MarketContext } from '../context'
import { shortenAddress } from '../utils'
import { NFTCardItems } from '../components'
import { Loader } from '../components/common'
import { ButtonGroup, ButtonGroupItemType } from '../components/common/buttonGroup'
import { getNFTByOwner } from '../context/marketContract'
import { toast } from 'react-toastify'

const NFTButtonGroup: ButtonGroupItemType[] = [
  { id: 'creation-button-1', title: 'Activas', active: true },
  { id: 'sale-button-2', title: 'Vendiendo', active: false },
  { id: 'shopping-button-3', title: 'Finalizadas', active: false },
]
interface INFTComponent {
  NFTs: IItem[]
  title: string
  isLoading: boolean
}

const NFTS: FC<INFTComponent> = ({ NFTs, title, isLoading }) => {
  return (
    <div>
      <h4 className="text-xl text-blue-500">{title}</h4>
      {<NFTCardItems items={NFTs ? NFTs : []} isLoading={isLoading} />}
    </div>
  )
}

const Dashboard: NextPage = () => {
  const { signer, marketContract, web3Provider, isConnected } = useContext(MarketContext)
  const [isLoading, setIsLoading] = useState(false)
  const [nftButtons, setNftButtons] = useState<ButtonGroupItemType[]>(NFTButtonGroup)
  const [balance, setBalance] = useState<string>('0')
  const [currentNFTItems, setCurrentNFTItems] = useState<IItem[]>([])
  const [NFTItems, setNFTItems] = useState<IItem[]>([])
  const [shoppingNFTItems, setShoppingNFTItems] = useState<IItem[] | null>(null)
  const [title, setTitle] = useState('Activas')

  useEffect(() => {
    if (!isConnected) return
    ;(async () => {
      const bal = !signer ? '0' : await web3Provider?.getBalance(signer)
      if (bal) setBalance(parseFloat(ethers.utils.formatEther(bal)).toFixed(2))
    })()
  }, [balance, isConnected])

  useEffect(() => {
    getNFTs()
  }, [signer, marketContract])

  const getNFTs = async () => {
    if (!marketContract || !signer) return
    try {
      setIsLoading(true)
      const itemsBySeller = await getNFTBySeller(marketContract!)
      const items = await getItems(marketContract, itemsBySeller)
      setNFTItems(items)
      setIsLoading(false)
      setCurrentNFTItems(items)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error('Hubo un error')
    }
  }

  const getOwnerNFTs = async () => {
    if (!marketContract) return
    try {
      if (!shoppingNFTItems) {
        setIsLoading(true)
        const itemsByOwner = await getNFTByOwner(marketContract!)
        const items = await getItems(marketContract, itemsByOwner)
        setShoppingNFTItems(items)
        setIsLoading(false)
        setCurrentNFTItems(items)
      } else {
        setCurrentNFTItems(shoppingNFTItems)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error('Hubo un error')
    }
  }

  const getMySales = () => {
    return getSoldNFT(NFTItems)
  }

  const handleButtonGroup = (item: ButtonGroupItemType) => (ev: React.MouseEvent) => {
    const items = nftButtons.map((i) => {
      if (item.id === i.id) {
        i.active = true
      } else {
        i.active = false
      }
      return i
    })
    setNftButtons(items)
    showNFT()
  }

  const showNFT = () => {
    const item = nftButtons.filter((i) => i.active)[0]
    switch (item.id) {
      case 'creation-button-1':
        setCurrentNFTItems(NFTItems)
        setTitle('Activas')
        break
      case 'sale-button-2':
        setCurrentNFTItems(getMySales())
        setTitle('Vendiendo')
        break
      default:
        getOwnerNFTs()
        setTitle('Finalizadas')
    }
  }

  return (
    <div className="bg-gradient py-5">
      <Head>
        <title>Panel de control</title>
        <meta name="description" content="NFT Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!isConnected ? (
        <h2 className="bg-gradient text-white p-10">Por favor conecta tu wallet</h2>
      ) : (
        <div>
          <section className="bg-gradient text-white grid grid-cols-[30%_70%] w-[80vw] items-center justify-center my-0 mx-auto">
            <div className="flex flex-col items-center justify-evenly text-xl">
              <h3 className="py-2">Mi wallet: {signer && shortenAddress(signer!)}</h3>
              <h3 className="py-2">Balance: {balance} eth</h3>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="py-4">
                <h2 className="text-3xl text-pink-600 text-center py-3">Mis publicaciones</h2>
                <hr className="bg-pink-400" />
              </div>
              <div className="flex items-center justify-center">
                <ButtonGroup items={nftButtons} handleButtonGroup={handleButtonGroup} />
              </div>
            </div>
          </section>
          <div className="bg-gradient text-white flex items-center justify-center pt-5">
            {isLoading ? (
              <Loader className="w-[200px] h-[200px]" size={300} />
            ) : (
              <NFTS NFTs={currentNFTItems} title={title} isLoading={isLoading} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
