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
  totalNFTItems: 0,
  offSetNFTItems: 0,
  getMarketPlaceItems() {},
  filterCoin(searchText: string) {},
  resetNFTtems() {},
  getListingFee(marketContract: Contract): Promise<string> {
    return new Promise(() => '')
  },
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
