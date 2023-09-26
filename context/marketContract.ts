import axios from 'axios'
import { BigNumber, Contract, ethers } from 'ethers'
import { ICoin, ICoinFeatures, IItem, IMetaData } from '../interfaces'

const defaultItem = {
  itemId: '',
  price: '',
  tokenId: '0',
  seller: '',
  owner: '',
  sold: '',
  image: '',
  description: '',
  name: '',
  createAt: '',
}

const defaultCoinInfo = {
  coinId: 0,
  name: '',
  price: 0 as unknown as BigNumber,
  supply: 0,
  seller: '',
  features: {} as ICoinFeatures,
  status: 0,
}

export const getListingFee = async (marketContract: Contract): Promise<string> => {
  const listingFee = await marketContract.getListingFee()
  return listingFee.toString()
}

export const getNFTBySeller = async (marketContract: Contract) => {
  return await marketContract.getNFTBySeller()
}

export const getNFTByOwner = async (marketContract: Contract) => {
  return await marketContract.getNFTByOwner()
}

export const getTotalItems = async (marketContract: Contract): Promise<number> => {
  const total = await marketContract.getTotalItems()
  return parseInt(total.toString())
}

export const fetchMarketItems = async ({
  marketContract,
  offSet,
  limit,
  solded,
}: {
  marketContract: Contract
  offSet: number
  limit: number
  solded: number
}) => {
  return await marketContract.fetchMarketItems(offSet, limit, solded)
}

export const getMarketItems = async ({ marketContract }: { marketContract: Contract }) => {
  return await marketContract.getMarketItems()
}

export const getCoins = async (marketContract: Contract, data: any[]): Promise<ICoin[]> => {
  const coins: ICoin[] = await Promise.all(
    data.map(async (i: ICoin) => {
      return await generateCoin(i, marketContract)
    }),
  )

  return coins.filter((coin: ICoin) => coin.coinId.toString() !== '0')
}

export const generateCoin = async (coin: ICoin, marketContract: Contract): Promise<ICoin> => {
  const price = ethers.utils.formatUnits(coin.price, 'ether')

  return {
    coinId: coin.coinId,
    name: coin.name,
    price,
    supply: coin.supply,
    seller: coin.seller,
    features: coin.features,
    status: coin.status,
  }
}

export const getSoldCoin = (coins: ICoin[]): ICoin[] => {
  return coins.filter((coin: ICoin) => coin.status === 1)
}

export const buyNFT = async ({
  marketContract,
  nftContract,
  itemId,
  price,
}: {
  marketContract: Contract
  nftContract: Contract
  itemId: string
  price: BigNumber
}): Promise<boolean | null> => {
  try {
    const transaction = await marketContract.buyNFT(nftContract.address, itemId, {
      value: price,
    })

    const tx = await transaction.wait()
    console.log('TX >>> ', tx)
    return true
  } catch (error) {
    console.log('error tx ', error)
    return null
  }
}

export const getNumberOfCoinsPublished = async (marketContract: Contract) => {
  const numberOfCoinsPublished = await marketContract.getNumberOfCoinsPublished()
  return numberOfCoinsPublished
}

export const getCoinInfo = async (marketContract: Contract, coinId: number): Promise<ICoin> => {
  const coinInfo = await marketContract.getCoinInfo(coinId)

  const coin: ICoin = {
    coinId: coinInfo[0].toNumber(),
    name: coinInfo[1],
    price: coinInfo[2],
    supply: coinInfo[3],
    seller: coinInfo[4],
    features: {
      mintingYear: coinInfo[5][0],
      material: coinInfo[5][1],
      origin: coinInfo[5][2],
      stateOfUse: coinInfo[5][3],
    },
    status: coinInfo[6],
  }

  return coin
}

export const getCoinsPerUser = async (marketContract: Contract, user: string): Promise<BigNumber[]> => {
  const coinsPerUser = await marketContract.getCoinInfoPerUser(user)
  return coinsPerUser
}
