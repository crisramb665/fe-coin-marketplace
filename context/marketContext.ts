import { Contract } from 'ethers'
import { createContext } from 'react'
import { IMarketContext, ICoin } from './index'
import { BigNumber } from 'ethers'

export const contextDefaultValues: IMarketContext = {
  isConnected: false,
  web3Provider: undefined,
  signer: undefined,
  marketContract: null,
  coinFilterItems: [],
  txs: [],
  totalNFTItems: 0,
  offSetNFTItems: 0,
  getMarketPlaceItems() {},
  getTransactions() {},
  filterCoin(searchText: string) {},
  resetNFTtems() {},

  connectWallet() {},
  getNumberOfCoinsPublished(marketContract: Contract): Promise<number> {
    return new Promise(() => 0)
  },
  getCoinInfo(marketContract: Contract, coinId: number): Promise<ICoin> {
    return new Promise(() => {})
  },
  getCoinsPerUser(marketContract, user): Promise<BigNumber[]> {
    return new Promise(() => [])
  },
}

export const MarketContext = createContext<IMarketContext>(contextDefaultValues)
