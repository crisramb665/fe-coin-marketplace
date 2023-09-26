import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'

const styles = {
  brand: 'flex items-center justify-center cursor-pointer',
  icon: 'w-[15em] h-[2em]',
}

export const Brand: NextPage = () => {
  return (
    <Link href="/">
      <div className={styles.brand}>
        <i>
          <svg width="208" height="28" viewBox="0 0 208 28" fill="none" className={styles.icon}>
            <text
              textAnchor="center"
              fontFamily="'Noto Sans Mono'"
              fontSize="24"
              id="svg_6"
              y="20"
              x="34"
              strokeWidth="0"
              stroke="#ffffff"
              fill="#ffffff"
            >
              Coin Marketplace
            </text>
          </svg>
        </i>
      </div>
    </Link>
  )
}
