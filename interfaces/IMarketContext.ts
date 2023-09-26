import { BigNumber, Contract, providers } from 'ethers'
import { IItem, ICoin, ITx } from './INFT'

export interface IMarketContext {
  isConnected: boolean
  web3Provider: providers.Web3Provider | undefined
  signer: string | undefined
  marketContract: Contract | null
  coinFilterItems: ICoin[]
  txs: ITx[]
  totalNFTItems: number
  offSetNFTItems: number
  filterCoin: (searchText: string) => void
  resetNFTtems: () => void
  getMarketPlaceItems: () => void
  getTransactions: () => void
  connectWallet: () => void
  getListingFee: (marketContract: Contract) => Promise<string>
  getNumberOfCoinsPublished: (marketContract: Contract) => Promise<number>
  getCoinInfo: (marketContract: Contract, coinId: number) => Promise<ICoin>
  getCoinsPerUser: (marketContract: Contract, user: string) => Promise<BigNumber[]>
}
