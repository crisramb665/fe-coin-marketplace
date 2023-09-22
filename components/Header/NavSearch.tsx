import React, { ChangeEvent, useContext, useState } from 'react'
import { SearchIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { MarketContext } from '../../context'

const styles = {
  searchContainer: 'self-center relative w-full rounded-2xl p-1 bg-white',
  icon: 'w-6 h-6 fill-blue-500 absolute top-1',
  inputField: 'text-black ml-6 w-[90%] outline-none',
}

export const NavSearch = () => {
  const { filterNFT } = useContext(MarketContext)
  const [searchText, setSearchText] = useState('')
  const router = useRouter()
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (router.pathname !== '/explore') return
    setSearchText(event.target.value)
    filterNFT(event.target.value)
  }

  const handleFocus = () => {
    if (router.pathname !== '/explore') {
      toast.info('Sólo puedes buscar en la sección "Explorar"', { autoClose: 3000 })
      return
    }
  }

  return (
    <div className={styles.searchContainer}>
      <SearchIcon className={styles.icon} />
      <input
        type="search"
        placeholder="Busca monedas por el nombre"
        className={styles.inputField}
        value={searchText}
        onChange={handleSearch}
        onFocus={handleFocus}
      />
    </div>
  )
}
