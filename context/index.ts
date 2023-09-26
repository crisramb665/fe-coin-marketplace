export { MarketContext, contextDefaultValues } from './marketContext'
export type { IMarketContext, ICoin, ICoinFeatures, ITx } from '../interfaces'
export { MarketProvider } from './marketProvider'
export { getMarketContract } from './contract'
export { connect } from './walletConnection'
export {
  getSoldCoin,
  generateCoin,
  getNumberOfCoinsPublished,
  getNumberOfTransactions,
  getCoinInfo,
  getCoinsPerUser,
  getTxInfo,
} from './marketContract'
