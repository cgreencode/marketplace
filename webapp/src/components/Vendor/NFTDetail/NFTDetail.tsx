import React from 'react'

import { ENSDetail } from '../../AssetPage/ENSDetail'
import { EstateDetail } from '../../AssetPage/EstateDetail'
import { ParcelDetail } from '../../AssetPage/ParcelDetail'
import { WearableDetail } from '../../AssetPage/WearableDetail'
import { Props } from './NFTDetail.types'

const NFTDetail = (props: Props) => {
  const { nft } = props
  const { parcel, estate, wearable, ens } = nft.data as any
  return (
    <>
      {parcel ? <ParcelDetail nft={nft} /> : null}
      {estate ? <EstateDetail nft={nft} /> : null}
      {wearable ? <WearableDetail nft={nft} /> : null}
      {ens ? <ENSDetail nft={nft} /> : null}
    </>
  )
}

export default React.memo(NFTDetail)
