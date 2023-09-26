export { MarketContext, contextDefaultValues } from './marketContext'
export type { IMarketContext, IItem, INFTToken, ICoin, ICoinFeatures } from '../interfaces'
export { MarketProvider } from './marketProvider'
export { getMarketContract } from './contract'
export { connect } from './walletConnection'
export {
  getListingFee,
  // getItems,
  getNFTBySeller,
  getSoldCoin,
  generateCoin,
  fetchMarketItems,
  getTotalItems,
  getNumberOfCoinsPublished,
  getCoinInfo,
  getCoinsPerUser,
} from './marketContract'
