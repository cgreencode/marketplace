import React, { useCallback, useMemo, useState } from 'react'
import { NFTCategory, Rarity } from '@dcl/schemas'
import { Center, Loader, WearablePreview } from 'decentraland-ui'
import { LazyImage } from 'react-lazy-images'

import { getAssetImage, getAssetName } from '../../modules/asset/utils'
import { getSelection, getCenter } from '../../modules/nft/estate/utils'
import { Atlas } from '../Atlas'
import { Props } from './AssetImage.types'
import './AssetImage.css'

// 1x1 transparent pixel
const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII='

const valueToHex = (value: number) =>
  ('00' + Math.min(255, (value * 255) | 0).toString(16)).slice(-2)

const colorToHex = (color: { r: number; g: number; b: number }) =>
  valueToHex(color.r) + valueToHex(color.g) + valueToHex(color.b)

const AssetImage = (props: Props) => {
  const {
    asset,
    isDraggable,
    withNavigation,
    hasPopup,
    zoom,
    isSmall,
    showMonospace,
    avatar
  } = props
  const { parcel, estate, wearable, ens } = asset.data

  const [isLoadingWearablePreview, setIsLoadingWearablePreview] = useState(
    isDraggable
  )
  const [wearablePreviewError, setWearablePreviewError] = useState(false)
  const handleLoad = useCallback(() => setIsLoadingWearablePreview(false), [])
  const handleError = useCallback(() => setWearablePreviewError(true), [])

  const estateSelection = useMemo(() => (estate ? getSelection(estate) : []), [
    estate
  ])

  switch (asset.category) {
    case NFTCategory.PARCEL: {
      const x = +parcel!.x
      const y = +parcel!.y
      const selection = [{ x, y }]
      return (
        <Atlas
          x={x}
          y={y}
          isDraggable={isDraggable}
          withPopup={hasPopup}
          withNavigation={withNavigation}
          selection={selection}
          zoom={zoom}
        />
      )
    }

    case NFTCategory.ESTATE: {
      const [x, y] = getCenter(estateSelection)
      return (
        <Atlas
          x={x}
          y={y}
          isDraggable={isDraggable}
          withPopup={hasPopup}
          withNavigation={withNavigation}
          selection={estateSelection}
          zoom={zoom}
          isEstate
        />
      )
    }

    case NFTCategory.WEARABLE: {
      let wearablePreview = null
      const isDev = process.env.REACT_APP_NETWORK !== 'mainnet'

      if (isDraggable) {
        let itemId: string | undefined
        let tokenId: string | undefined
        let skin = 'bbbbbb'
        let hair = 'bbbbbb'
        let shape: 'male' | 'female' = 'male'
        if ('itemId' in asset && asset.itemId) {
          itemId = asset.itemId
        } else if ('tokenId' in asset && asset.tokenId) {
          tokenId = asset.tokenId
        }
        if (avatar) {
          skin = colorToHex(avatar.avatar.skin.color)
          hair = colorToHex(avatar.avatar.hair.color)
          shape = avatar.avatar.bodyShape.toLowerCase().includes('female')
            ? 'female'
            : 'male'
        }

        wearablePreview = (
          <>
            {isLoadingWearablePreview && (
              <Center>
                <Loader
                  className="wearable-preview-loader"
                  active
                  size="large"
                />
              </Center>
            )}
            <WearablePreview
              contractAddress={asset.contractAddress}
              itemId={itemId}
              tokenId={tokenId}
              skin={skin}
              hair={hair}
              shape={shape}
              dev={isDev}
              onLoad={handleLoad}
              onError={handleError}
            />
          </>
        )
      }
      const [light, dark] = Rarity.getGradient(wearable!.rarity)
      const backgroundImage = `radial-gradient(${light}, ${dark})`
      const classes =
        'rarity-background ' +
        (isLoadingWearablePreview ? 'is-loading-wearable-preview' : '')
      const showWearablePreview = !!wearablePreview && !wearablePreviewError
      return (
        <div
          className={classes}
          style={{
            backgroundImage
          }}
        >
          {showWearablePreview ? (
            wearablePreview
          ) : (
            <img
              alt={getAssetName(asset)}
              className="image"
              src={getAssetImage(asset)}
            />
          )}
        </div>
      )
    }

    case NFTCategory.ENS: {
      let name = ens!.subdomain
      let classes = ['ens-subdomain']
      if (isSmall) {
        name = name.slice(0, 2)
        classes.push('small')
      }
      return (
        <div className={classes.join(' ')}>
          <div className="name">{name}</div>
          {showMonospace ? <div className="monospace">{name}</div> : null}
        </div>
      )
    }

    default: {
      return (
        <LazyImage
          src={getAssetImage(asset)}
          alt={getAssetName(asset)}
          debounceDurationMs={1000}
          placeholder={({ ref }) => (
            <div ref={ref}>
              <Loader size="small" active />
            </div>
          )}
          actual={({ imageProps }) => (
            <img className="image" alt={getAssetName(asset)} {...imageProps} />
          )}
        />
      )
    }
  }
}

// the purpose of this wrapper is to make the div always be square, by using a 1x1 transparent pixel
const AssetImageWrapper = (props: Props) => {
  const { asset, className, ...rest } = props

  let classes = 'AssetImage'
  if (className) {
    classes += ' ' + className
  }

  return (
    <div className={classes}>
      <img src={PIXEL} alt="pixel" className="pixel" />
      <div className="image-wrapper">
        <AssetImage asset={asset} {...rest} />
      </div>
    </div>
  )
}

AssetImage.defaultProps = {
  isDraggable: false,
  withNavigation: false,
  zoom: 0.5,
  isSmall: false,
  showMonospace: false
}

export default React.memo(AssetImageWrapper)
