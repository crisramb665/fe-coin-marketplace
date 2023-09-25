import { BigNumber } from "ethers"

export interface IItem {
  itemId: string
  price: string
  tokenId: string
  seller: string
  owner: string
  sold: string
  image: string
  name: string
  description: string
  createAt: string
}

export interface INFTToken {
  price: string
  description: string
  name: string
  image: string
}

export interface IMetaData {
  name: string
  description: string
  image: string
}

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
