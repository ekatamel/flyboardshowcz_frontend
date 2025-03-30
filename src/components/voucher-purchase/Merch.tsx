import cross from 'assets/images/cross.svg'
import clsx from 'clsx'
import { Layout } from 'components/shared/Layout'
import { SkeletonTiles } from 'components/shared/SkeletonTiles'
import { QuantitySelector } from 'components/voucher-purchase-form/QuantitySelector'
import { useFormikContext } from 'formik'
import { motion } from 'framer-motion'
import { useToastMessage } from 'hooks/useToastMesage'
import { groupBy, map } from 'lodash'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { MerchInfo, Order } from 'types/types'
import { fetchMerch } from 'utils/requests'
import {
  bestSellerItemIds,
  listVariants,
  merchToIconUrlMapping,
} from 'utils/utils'

import { Tile } from '../shared/Tile'
import { Basket } from '../voucher-purchase-form/Basket'

export const Merch = () => {
  const { showToast, isActive } = useToastMessage()

  const { values } = useFormikContext<Order>()

  const {
    data: merch,
    isLoading,
    isError,
  } = useQuery<MerchInfo[]>('merch', fetchMerch)

  const bestSellerMerchIds = bestSellerItemIds.merch

  if (isError && !isActive('merch-error'))
    showToast({
      id: 'merch-error',
      status: 'error',
      message: 'Nepodařilo se načíst produkty. Zkuste prosím později.',
    })

  const preSelectedMerch = values.lessonType.flatMap(
    lesson => lesson.merch ?? [],
  ) as MerchInfo[]

  const groupedPreselectedMerch = groupBy(preSelectedMerch, 'id')
  // E.g. for Flyboard darkovy set
  const preselectedMerchWithQuantity = map(groupedPreselectedMerch, group => ({
    ...group[0],
    quantity: group.length,
  }))

  const allMerchItems = [
    ...preselectedMerchWithQuantity,
    ...(merch || []),
  ] as MerchInfo[]

  const merchHasSizeToSelectMap = new Map(
    allMerchItems.map(merch => [
      merch.id,
      Object.keys(merch.available_sizes).length > 0,
    ]),
  )

  // Selected merch items either don't have sizes, or size was selected
  const isMerchSelectionComplete = [
    ...(values.merch ?? []),
    ...preselectedMerchWithQuantity,
  ].every(
    merch =>
      !merchHasSizeToSelectMap.get(merch.id) ||
      (merchHasSizeToSelectMap.get(merch.id) && merch.size),
  )

  return (
    <Layout
      stepName='Merch'
      title='Něco na sebe?'
      rightComponent={<Basket />}
      isNextDisabled={!isMerchSelectionComplete}
      disabledText={
        !isMerchSelectionComplete
          ? 'Jedna či více položek nemá vybranou velikost. Klikněte na položku pro výber velikosti'
          : ''
      }
    >
      <p className='mx-20 flex flex-col text-center text-14 text-white sm:mx-44 md:mx-80 lg:mx-100 lg:text-16 xl:mx-0'>
        <span>Nění důležité létat nejlíp, ale hlavně být nejkrásnější!</span>
        <span>
          Nákupem FBS merche finančně podpoříte trénink mladých nadějných
          flyboardistů a budoucí generace reprezentantů.
        </span>
      </p>

      {isLoading ? (
        <SkeletonTiles number={6} />
      ) : (
        <motion.div
          variants={listVariants}
          className='xl:justify-left mx-20 mt-30 flex flex-wrap justify-center gap-x-28 gap-y-10 sm:mx-44 md:mx-80 lg:mx-100 xl:mx-0'
          initial='initial'
          animate='animate'
        >
          {allMerchItems.map(product => {
            if (product.price === 0 && !product.quantity) return null // Don't show FREE merch if it is not part of preselected merch with lesson
            return (
              <motion.div variants={listVariants} key={product.id}>
                <MerchItem
                  product={product}
                  preSelectedQuantity={product.quantity}
                  isBestseller={bestSellerMerchIds.includes(product.id)}
                  preselectedMerchWithQuantity={preselectedMerchWithQuantity}
                />
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </Layout>
  )
}

interface MerchItemProps {
  product: MerchInfo
  preSelectedQuantity: number
  isBestseller: boolean
  preselectedMerchWithQuantity: MerchInfo[]
}

export const MerchItem = ({
  product,
  preSelectedQuantity,
  isBestseller,
  preselectedMerchWithQuantity,
}: MerchItemProps) => {
  const { values, setValues } = useFormikContext<Order>()

  const [isSelected, setIsSelected] = useState(
    [...(values.merch ?? []), ...preselectedMerchWithQuantity]?.some(
      item => item.id === product.id,
    ),
  )

  const [showOverlay, setShowOverlay] = useState(false)
  const [sizeSelected, setSizeSelected] = useState<string | null>(null)

  const sizes = Object.values(product.available_sizes)

  const selectedMerch = values.merch?.find(
    merchItem => merchItem.id === product.id,
  )

  const icon = merchToIconUrlMapping[product.id]

  const onAmountDecrease = () => {
    setValues(storedValues => {
      const merchToRemove = storedValues.merch?.find(
        merch => merch.id === product.id,
      )

      if (merchToRemove && merchToRemove.quantity > 1) {
        return {
          ...storedValues,
          merch: storedValues.merch?.map(product => ({
            ...product,
            quantity:
              product.id === merchToRemove.id
                ? product.quantity - 1
                : product.quantity,
          })),
        }
      } else {
        setIsSelected(false)
        return {
          ...storedValues,
          merch: storedValues.merch?.filter(merch => merch.id !== product.id),
        }
      }
    })
  }

  const onAmountIncrease = () => {
    setValues(storedValues => {
      const merchToAdd = storedValues.merch?.find(
        merch => merch.id === product.id,
      )

      return {
        ...storedValues,
        merch: merchToAdd
          ? storedValues.merch?.map(product => ({
              ...product,
              quantity:
                product.id === merchToAdd.id
                  ? product.quantity + 1
                  : product.quantity,
            }))
          : storedValues.merch,
      }
    })
  }

  const onTileClick = () => {
    if (preSelectedQuantity && sizes.length > 0) {
      setShowOverlay(true)
      return
    }
    if (preSelectedQuantity) return
    // Unselect merch and remove merch item from values
    if (selectedMerch) {
      setValues(values => ({
        ...values,
        merch: values.merch?.filter(merchItem => merchItem.id !== product.id),
      }))
      setIsSelected(false)
      setSizeSelected(null)
    } else {
      setValues(values => ({
        ...values,
        merch: [
          ...(values.merch || []),
          {
            id: product.id,
            discountedPrice: product.price,
            name: product.name,
            quantity: 1,
          },
        ],
      }))
      setIsSelected(true)
      if (sizes.length > 0) setShowOverlay(true)
    }
  }

  return (
    <div className='flex h-150 flex-col lg:h-196' key={product.id}>
      <Tile
        badgeText={isBestseller ? 'Bestseller' : ''}
        tooltip={
          sizes.length > 0
            ? 'Daná položka vyžaduje výběr velikosti. Klikněte na položku pro výber velikosti'
            : undefined
        }
        title={product.name}
        icon={icon}
        subtitle={`${product.price},-`}
        isSelected={isSelected}
        onClick={onTileClick}
        overlay={
          sizes.length > 0 && showOverlay ? (
            <SizeOverlay
              isPreSelected={preSelectedQuantity > 0}
              product={product}
              sizes={sizes}
              setShowOverlay={setShowOverlay}
              sizeSelected={sizeSelected}
              setSizeSelected={setSizeSelected}
            />
          ) : null
        }
      />
      {isSelected && (
        <QuantitySelector
          onAmountDecrease={() => {
            onAmountDecrease()
            if (selectedMerch?.quantity === 1) setShowOverlay(false)
          }}
          isDecreaseDisabled={!!preSelectedQuantity}
          onAmountIncrease={onAmountIncrease}
          isIncreaseDisabled={!!preSelectedQuantity}
          initialQuantity={preSelectedQuantity || selectedMerch?.quantity || 0}
        />
      )}
    </div>
  )
}

interface SizeOverlayProps {
  sizes: string[]
  product: MerchInfo
  setShowOverlay: (show: boolean) => void
  sizeSelected: string | null
  setSizeSelected: (size: string | null) => void
  isPreSelected: boolean
}

const SizeOverlay = ({
  sizes,
  product,
  setShowOverlay,
  sizeSelected,
  setSizeSelected,
  isPreSelected,
}: SizeOverlayProps) => {
  const widthDenominator =
    (sizes.length + 1) % 2 === 0
      ? (sizes.length + 1) / 2
      : (sizes.length + 2) / 2

  return (
    <div className='flex h-100 w-114 cursor-pointer flex-wrap rounded border border-yellow text-center font-title text-22 text-base text-white lg:h-140 lg:w-168'>
      {sizes.map(size => {
        return (
          <SizeCell
            key={size}
            size={size}
            product={product}
            widthDenominator={widthDenominator}
            sizeSelected={sizeSelected}
            setSizeSelected={setSizeSelected}
            isPreSelected={isPreSelected}
          />
        )
      })}
      <div
        className='flex flex-1 items-center justify-center border-yellow p-12'
        onClick={() => setShowOverlay(false)}
      >
        <img src={cross} alt='Cross icon' />
      </div>
    </div>
  )
}

interface SizeCellProps {
  size: string
  product: MerchInfo
  widthDenominator: number
  sizeSelected: string | null
  setSizeSelected: (size: string | null) => void
  isPreSelected: boolean
}

export const SizeCell = ({
  size,
  product,
  widthDenominator,
  sizeSelected,
  setSizeSelected,
  isPreSelected,
}: SizeCellProps) => {
  const { setValues } = useFormikContext<Order>()

  const onSizeSelect = () => {
    setValues(storedValues => {
      if (isPreSelected) {
        return {
          ...storedValues,
          lessonType: storedValues.lessonType.map(lesson => ({
            ...lesson,
            merch: lesson.merch?.map(merch =>
              merch.id === product.id
                ? {
                    ...merch,
                    size,
                  }
                : merch,
            ),
          })),
        }
      }

      // Add size to all products of this category
      const storedProducts = storedValues.merch?.map(merch =>
        merch.id === product.id
          ? {
              ...merch,
              size,
            }
          : merch,
      )

      return {
        ...storedValues,
        merch: storedProducts ?? [],
      }
    })
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center border border-yellow p-12',
        sizeSelected === size ? 'text-black' : 'text-white',
        sizeSelected === size && 'bg-yellow',
      )}
      style={{ width: `${100 / widthDenominator}%` }}
      onClick={() => {
        setSizeSelected(size)
        onSizeSelect()
      }}
    >
      {size}
    </div>
  )
}
