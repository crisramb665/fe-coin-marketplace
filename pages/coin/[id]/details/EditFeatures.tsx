import Head from 'next/head'
import Image from 'next/image'
import React, { useContext, useRef, useState } from 'react'

import { MarketContext } from '../../../../context/marketContext'
import { NFTStorage, File } from 'nft.storage'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { TransactionProgress } from '../../../../components/common/TransactionProgress'
import { UploadIcon } from '@heroicons/react/solid'
import { ICoin, getCoinInfo } from '../../../../context'
// import { NFT_STORAGE_API_KEY } from '../utils/constants'

// const client = new NFTStorage({
//   token: NFT_STORAGE_API_KEY!,
// })
interface CoinFeaturesInfo {
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

const EditCoinListing = () => {
  const { signer, isConnected, marketContract, getListingFee, getNumberOfCoinsPublished } = useContext(MarketContext)
  const [fileUrl, setFileUrl] = useState<string>('')

  const [form, setForm] = useState<CoinFeaturesInfo>({
    mintingYear: '',
    material: '',
    origin: '',
    stateOfUse: '',
  })

  const [listingFee, setListingFee] = useState('0')
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [txWait, setTxWait] = useState(false)

  const fileInput = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { id: coinId } = router.query
  console.log('coinIddddd', coinId)

  const triggerOnChange = () => {
    if (!fileInput.current) return
    fileInput.current.click()
  }

  // async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   if (!e.target.files) return
  //   const { name, description } = form
  //   if (!name || !description) {
  //     toast.info('Campos incompletos')
  //     return
  //   }
  //   const file = e.target.files[0]
  //   if (!file || !file.type.match(/image.*/)) {
  //     toast.error('Por favor selecciona una imagen')
  //     return
  //   }
  //   try {
  //     setUploading(true)
  //     const imageFile = new File([file], `${file.name}.${file.type}`, {
  //       type: `image/${file.type}`,
  //     })
  //     const metadata = await client.store({
  //       name,
  //       description,
  //       image: imageFile,
  //     })
  //     setFileUrl(metadata.url)
  //     setImageUrl(metadata.data.image.href)
  //     setUploading(false)
  //   } catch (e) {
  //     console.log('Error uploading file: ', e)
  //     toast.error(`Error uploading file:`)
  //     setUploading(false)
  //   }
  // }

  const editCoinFeatutes = async () => {
    const { mintingYear, material, origin, stateOfUse } = form
    if (!mintingYear || !material || !origin || !stateOfUse) {
      toast.info('Todos los campos son requeridos')
      return
    }

    try {
      editFeatures()
    } catch (error) {
      console.log(`error editando listing de la moneda `, error)
      toast.error('Error al editar.')
    }
  }

  const editFeatures = async () => {
    if (!marketContract) return
    let toastTx = toast.loading('Por favor espera...', {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
    })
    try {
      setTxWait(true)

      const _coinId = Number(coinId)
      const _mintingYear = form.mintingYear
      const _material = form.material
      const _origin = form.origin
      const _stateOfUse = Number(form.stateOfUse)

      toastTx = toast.loading('Por favor espera...', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      // const transaction = await marketContract.listCoin(_name, _price, _supply, { value: listingFee })
      const transaction = await marketContract.editCoinFeatures(_coinId, _mintingYear, _material, _origin, _stateOfUse)

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
        <title>Editando moneda</title>
        <meta name="description" content="Coin Edit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isConnected ? (
        <div className="mx-auto my-6 flex justify-center items-center">
          <div className="w-[70%]">
            <div className="grid grid-cols-[1fr_300px] gap-24 items-center justify-center">
              <div className="flex flex-col pb-12 text-black">
                <h2 className="text-white text-3xl text-center">Editar listing de moneda</h2>
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
                    onClick={editCoinFeatutes}
                    // onClick={() => console.log('creando listing en proceso')}
                    className="font-bold mt-4 bg-gradient-to-r from-[#1199fa] to-[#11d0fa]  rounded-md text-white  p-4 shadow-lg"
                  >
                    Editar
                  </button>
                ) : (
                  <TransactionProgress />
                )}
              </div>
              {/* 
              {imageUrl ? (
                <div className="w-[300px] h-[300px]">
                  <Image
                    src={`https://ipfs.io/ipfs/${imageUrl.slice(7)}`}
                    unoptimized
                    alt="Picture of the author"
                    className="rounded mt-4"
                    layout="responsive"
                    width={300}
                    height={300}
                    placeholder={'blur'}
                    blurDataURL={DATA_URL}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center w-[300px] h-[300px] rounded-md border-2 border-blue-500">
                    <h4 className="text-2xl">Not Image</h4>
                  </div>
                  {uploading && <p className="py-3 text-center">Uploading...</p>}
                </div>
              )}
               */}
            </div>
          </div>
        </div>
      ) : (
        <WalletConnect />
      )}
    </div>
  )
}

export default EditCoinListing
