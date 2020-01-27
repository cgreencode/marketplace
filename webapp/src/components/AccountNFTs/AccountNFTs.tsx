import React, { useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Loader } from 'decentraland-ui'

import { NFTCard } from '../NFTCard'
import { getSearchCategory, Section } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { MAX_QUERY_SIZE } from '../../lib/api/client'
import { Props } from './AccountNFTs.types'
import './AccountNFTs.css'

const AccountNFTs = (props: Props) => {
  const {
    address,
    page,
    section,
    sortBy,
    account,
    nfts,
    onFetchAccount,
    isLoading
  } = props

  const [offset] = useState(0)

  // @nico TODO: Support LoadMore? Maybe extract it from MarketPage first to avoid repetition
  useEffect(() => {
    const category = getSearchCategory(section)
    const isLand = section === Section.LAND

    onFetchAccount({
      variables: {
        first: MAX_QUERY_SIZE,
        skip: 0,
        isLand,
        category,
        address
      },
      view: View.ACCOUNT
    })
  }, [address, offset, page, section, sortBy, onFetchAccount])

  return (
    <div className="AccountNFTs">
      {isLoading ? (
        <Loader size="massive" active />
      ) : account ? (
        <Card.Group>
          {nfts.map(nft => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </Card.Group>
      ) : (
        <div className="empty">
          {t('account_nfts.empty_account', { address })}
        </div>
      )}
    </div>
  )
}

export default React.memo(AccountNFTs)
