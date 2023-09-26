import { IItem, ICoin } from '../../interfaces'
import { NFTCard } from './NFTCard'

export const NFTCardItems = (props: { items: ICoin[]; message?: string; isLoading?: boolean }) => {
  const { items, message = 'Moneda no encontrada', isLoading = false } = props

  const coins = items.map((i: ICoin) => {
    if (Array.isArray(i) && i.length > 0) {
      const firstElement = Number(i[0])
      return [firstElement, ...i.slice(1)]
    }

    return i
  }) as unknown as ICoin[]

  return (
    <div className="bg-gradient grid grid-cols-3 gap-12 py-8">
      {coins.length > 0
        ? coins.map((coin: ICoin) => (
            <div key={coin.coinId as number}>
              <NFTCard {...coin} />
            </div>
          ))
        : !isLoading && (
            <div>
              <h3 className="text-white text-center text-2xl">{message}</h3>
            </div>
          )}
    </div>
  )
}
