import Head from 'next/head'
import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { MarketContext } from '../context'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { TransactionProgress } from '../components/common'

interface CoinForm {
  name: string
  price: string
  supply: string
  mintingYear: string
  material: string
  origin: string
  stateOfUse: string
}

const WalletConnect = () => {
  return (
    <div>
      <h2>Por favor conecta tu wallet</h2>
    </div>
  )
}

const Create = () => {
  const { isConnected, marketContract } = useContext(MarketContext)
  const [form, setForm] = useState<CoinForm>({
    name: '',
    price: '',
    supply: '0',
    mintingYear: '',
    material: '',
    origin: '',
    stateOfUse: '',
  })

  const [txWait, setTxWait] = useState(false)

  const router = useRouter()

  const listCoin = async () => {
    const { name, price, supply, mintingYear, material, origin, stateOfUse } = form
    if (!name || !price || !supply || !mintingYear || !material || !origin || !stateOfUse) {
      toast.info('Todos los campos son requeridos')
      return
    }

    try {
      createSale()
    } catch (error) {
      console.log(`error creando publicación de moneda `, error)
      toast.error('Error al publicar.')
    }
  }

  const createSale = async () => {
    if (!marketContract) return
    let toastTx = toast.loading('Por favor espera...', {
      position: toast.POSITION.BOTTOM_RIGHT,
    })
    try {
      setTxWait(true)

      const _name = form.name
      const _price = ethers.utils.parseUnits(form.price, 'ether')
      const _supply = Number(form.supply)
      const _mintingYear = form.mintingYear
      const _material = form.material
      const _origin = form.origin
      const _stateOfUse = Number(form.stateOfUse)

      toastTx = toast.loading('Por favor espera...', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })

      const transaction = await marketContract.listCoin(
        _name,
        _price,
        _supply,
        _mintingYear,
        _material,
        _origin,
        _stateOfUse,
      )

      const tx = await transaction.wait()
      toast.update(toastTx, {
        render: 'Tx Ok',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })

      router.push('/dashboard')
    } catch (error) {
      toast.update(toastTx, {
        render: 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      setTxWait(false)
    }
  }

  return (
    <div className="bg-gradient text-white">
      <Head>
        <title>Publicar moneda</title>
        <meta name="description" content="NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isConnected ? (
        <div className="mx-auto my-6 flex justify-center items-center">
          <div className="w-[70%]">
            <div className="grid grid-cols-[1fr_300px] gap-24 items-center justify-center">
              <div className="flex flex-col pb-12 text-black">
                <h2 className="text-white text-3xl text-center">Publicar moneda</h2>
                <input
                  placeholder="Nombre de la moneda"
                  className="mt-8 border rounded p-4"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  placeholder="Precio en ETH"
                  className="mt-4 border rounded p-4"
                  type="number"
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                  placeholder="Año de acuñación"
                  className="mt-4 border rounded p-4"
                  onChange={(e) => setForm({ ...form, mintingYear: e.target.value })}
                />
                <input
                  placeholder="Material"
                  className="mt-4 border rounded p-4"
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                />
                <input
                  placeholder="Origen"
                  className="mt-4 border rounded p-4"
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                />
                <select
                  placeholder="Estado Físico"
                  className="mt-4 border rounded p-4"
                  value={form.stateOfUse}
                  onChange={(e) => setForm({ ...form, stateOfUse: e.target.value })}
                >
                  <option value="" disabled>
                    {' '}
                    Seleccione el estado de la moneda
                  </option>
                  <option value="0">UNC (No salió a circulación)</option>
                  <option value="1">XF (Perfecto estado)</option>
                  <option value="2">VF (Muy buen estado)</option>
                  <option value="3">F (Buen estado)</option>
                  <option value="4">G (Estado decente)</option>
                  <option value="5">P (Estado pobre)</option>
                </select>

                {!txWait ? (
                  <button
                    onClick={listCoin}
                    className="font-bold mt-4 bg-gradient-to-r from-[#1199fa] to-[#11d0fa]  rounded-md text-white  p-4 shadow-lg"
                  >
                    Publicar
                  </button>
                ) : (
                  <TransactionProgress />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <WalletConnect />
      )}
    </div>
  )
}

export default Create
