import Head from 'next/head'
import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { MarketContext } from '../context'
import { NFTStorage, File } from 'nft.storage'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { DATA_URL } from '../utils'
import { TransactionProgress } from '../components/common'
import { UploadIcon } from '@heroicons/react/solid'
import { NFT_STORAGE_API_KEY } from '../utils/constants'

const client = new NFTStorage({
  token: NFT_STORAGE_API_KEY!,
})
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
  const { isConnected, marketContract, getListingFee, getNumberOfCoinsPublished } = useContext(MarketContext)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [form, setForm] = useState<CoinForm>({
    name: '',
    price: '',
    supply: '0',
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
      // let transaction = await nftContract.createToken(fileUrl)

      // let tx = await transaction.wait()
      // toast.update(toastTx, {
      //   render: 'Tx Ok',
      //   type: 'success',
      //   isLoading: false,
      //   autoClose: 3000,
      //   position: toast.POSITION.BOTTOM_RIGHT,
      // })

      // let event = tx.events[0]
      // console.log('EVENT', event)
      // let value = event.args[2]
      // console.log('VALUE', value)

      // let tokenId = value.toNumber()
      // console.log('TOKEN-ID', tokenId)

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
      // const transaction = await marketContract.listCoin(_name, _price, _supply, { value: listingFee })
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

  // useEffect(() => {
  //   console.log('market contract????', marketContract)
  //   if (!marketContract) return
  //   ;(async () => {
  //     // // const fee = await getListingFee(marketContract)
  //     // // setListingFee(fee)
  //     // const numberOfCoinsPublished = await getNumberOfCoinsPublished(marketContract)
  //     // console.log('numberOfCoinsPublished', numberOfCoinsPublished)
  //   })()
  // }, [])

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

                {/* <input type="file" name="Asset" className="hidden" ref={fileInput} onChange={onChange} />
                {(!imageUrl || uploading) && (
                  <div className="my-4">
                    <button
                      className="p-2 bg-gradient-to-tr from-rose-400 to-rose-600 text-white rounded-md flex flex-row justify-between items-center"
                      onClick={triggerOnChange}
                    >
                      <UploadIcon className="fill-white w-5 h-5" />
                      <span>Cargar Imagen</span>
                    </button>
                  </div>
                )} */}
                {!txWait ? (
                  <button
                    onClick={listCoin}
                    // onClick={() => console.log('creando listing en proceso')}
                    className="font-bold mt-4 bg-gradient-to-r from-[#1199fa] to-[#11d0fa]  rounded-md text-white  p-4 shadow-lg"
                  >
                    Publicar
                  </button>
                ) : (
                  <TransactionProgress />
                )}

                {/* <h5 className="text-white mt-4">* Listing Price: {ethers.utils.formatEther(listingFee)} eth</h5> */}
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

export default Create
