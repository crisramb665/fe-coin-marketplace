import { Contract, ethers, providers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  MarketContext,
  getMarketContract,
  getListingFee,
  // getItems,
  IItem,
  getNumberOfCoinsPublished,
  getNumberOfTransactions,
  getCoinInfo,
  getCoinsPerUser,
  getTxInfo,
  ICoin,
  ITx,
} from './index'
import { getMarketItems, getTotalItems } from './marketContract'
import { connect } from './walletConnection'
import { RPC_URL } from '../utils/constants'
interface Props {
  children: JSX.Element | JSX.Element[]
}

type InitialStateType = {
  marketContract: Contract
  account: string
  web3Provider: providers.Web3Provider
}

export const MarketProvider = ({ children }: Props) => {
  const [marketContract, setMarketContract] = useState<Contract | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [web3Provider, setWeb3Provider] = useState<providers.Web3Provider | undefined>(undefined)
  const [signer, setSigner] = useState<string | undefined>(undefined)
  const [coinMarketItems, setCoinMarketItems] = useState<ICoin[] | []>([])
  const [coinFilterItems, setCoinFilterItems] = useState<ICoin[] | []>([])
  const [txs, setTxs] = useState<ITx[] | []>([])
  const [totalNFTItems, setTotalNFTItems] = useState(0)
  const [offSetNFTItems, setOffSetNFTItems] = useState(0)

  const router = useRouter()

  const providerEvents = () => {
    window.ethereum.on('accountsChanged', async () => {
      setIsConnected(false)
      setWeb3Provider(undefined)
      setMarketContract(null)
      setSigner(undefined)
      setCoinMarketItems([])
      setCoinFilterItems([])
      setTotalNFTItems(0)
      setOffSetNFTItems(0)
      router.push('/')
    })
  }

  const connectWallet = async () => {
    try {
      if (typeof window != 'undefined' && typeof window.ethereum != 'undefined' && window.ethereum.isMetaMask) {
        const web3Provider = await connect()

        if (!web3Provider) {
          toast.error('Hubo un error al conectar la wallet, verifica que hayas iniciado sesión en metamask')
          return
        }
        const { chainId } = await web3Provider.getNetwork()
        if (chainId !== 11155111) {
          window.alert('Cambia tu red a Sepolia Testnet')
          throw new Error('Cambia tu red a Sepolia Testnet')
        }

        const signer = web3Provider.getSigner()
        const accounts = await signer.provider.listAccounts()
        const marketContract = await getMarketContract(web3Provider, signer)

        setInitialState({
          web3Provider,
          account: accounts[0],
          marketContract,
        })
      } else {
        toast.info('Por favor instala Metamask!')
      }
    } catch (error) {
      console.error('error, what is the error: ', error)
      toast.error('Hubo un error al conectar la wallet, verifica que tengas instalado metamask y hayas iniciado sesión')
    }
  }

  const setInitialState = async ({ marketContract, account, web3Provider }: InitialStateType) => {
    setWeb3Provider(web3Provider)
    setSigner(account)
    setIsConnected(true)
    setMarketContract(marketContract)
    providerEvents()
  }

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

  const getMarketPlaceItems = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const marketContract = await getMarketContract(provider)

    if (!marketContract) return
    const total = await getNumberOfCoinsPublished(marketContract)

    if (total <= coinMarketItems.length) return
    const allCoins = (await getAllCoins(marketContract, Number(total))) ?? ([] as ICoin[])
    const filterActiveCoins = allCoins.filter((coin: ICoin) => coin.status !== 2)
    setCoinMarketItems((prev: ICoin[]) => filterActiveCoins)
  }

  const getAllTxs = async (marketContract: Contract, txIdIndexes: number) => {
    try {
      const txPromises = Array.from({ length: Number(txIdIndexes) }, async (_, i) => {
        return await getTxInfo(marketContract, i)
      })

      const txResult = await Promise.all(txPromises)
      return txResult
    } catch (error) {
      console.error(error)
    }
  }

  const getTransactions = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const marketContract = await getMarketContract(provider)

    if (!marketContract) return
    const total = await getNumberOfTransactions(marketContract)
    if (total <= txs.length) return
    const allTxs = (await getAllTxs(marketContract, Number(total))) ?? ([] as ITx[])
    setTxs(allTxs)
  }

  const resetNFTtems = async () => {
    setCoinMarketItems([])
    setCoinFilterItems([])
    setTotalNFTItems(0)
    setOffSetNFTItems(0)
  }

  useEffect(() => {
    setCoinFilterItems((prev) => coinMarketItems)
  }, [coinMarketItems])

  const filterCoin = (searchText: string) => {
    const filtered = coinMarketItems.filter((coin: ICoin) => coin.name.toLowerCase().includes(searchText.toLowerCase()))
    setCoinFilterItems([...filtered])
  }

  return (
    <MarketContext.Provider
      value={{
        isConnected,
        web3Provider,
        signer,
        marketContract,
        coinFilterItems,
        txs,
        totalNFTItems,
        offSetNFTItems,
        filterCoin,
        resetNFTtems,
        getMarketPlaceItems,
        getTransactions,
        getListingFee,
        connectWallet,
        getNumberOfCoinsPublished,
        getCoinInfo,
        getCoinsPerUser,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}
