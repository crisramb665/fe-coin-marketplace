import { Contract, ethers, providers } from 'ethers'
import { MARKET_CONTRACT } from '../utils'

export const getMarketContract = async (
  provider: providers.Web3Provider | providers.JsonRpcProvider,
  signer?: providers.JsonRpcSigner,
): Promise<Contract> => {
  const { chainId } = await provider.getNetwork()
  const key = chainId.toString()
  const marketAddress = MARKET_CONTRACT[key].address
  const marketAbi = MARKET_CONTRACT[key].abi
  const signerOrProvider: providers.Web3Provider | providers.JsonRpcProvider | providers.JsonRpcSigner = !signer
    ? provider
    : signer
  const marketContract = new ethers.Contract(marketAddress, marketAbi, signerOrProvider)
  return marketContract
}
