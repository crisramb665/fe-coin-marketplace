import { BigNumber } from 'ethers'

export interface ICoinFeatures {
  mintingYear: string
  material: string
  origin: string
  stateOfUse: number
}
export interface ICoin {
  coinId: BigNumber | number
  name: string
  price: BigNumber | string
  supply: number
  seller: string
  features: ICoinFeatures
  status: number
}

export interface ITx {
  id: BigNumber | number
  coinId: BigNumber | number
  seller: string
  buyer: string
  sentTimestamp: number
  status: number
}
