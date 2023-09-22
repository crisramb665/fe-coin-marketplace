import { NextPage } from 'next'
import React from 'react'
import { TopCollectibles } from '../../components'
import { Footer } from '../footer/Footer'

const styles = {
  container: 'bg-gradient',
}

export const Hero: NextPage = () => {
  return (
    <div className={styles.container}>
      <TopCollectibles />
      <Footer />
    </div>
  )
}
