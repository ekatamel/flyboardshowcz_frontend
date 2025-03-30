import { useOutsideClick } from '@chakra-ui/react'
import cross from 'assets/images/cross.svg'
import clsx from 'clsx'
import { Layout } from 'components/shared/Layout'
import { SkeletonTiles } from 'components/shared/SkeletonTiles'
import { Tile } from 'components/shared/Tile'
import { Basket } from 'components/voucher-purchase-form/Basket'
import { FormNavigationContext } from 'context/ReservationFormNavigationContext'
import { useFormikContext } from 'formik'
import { motion } from 'framer-motion'
import { useToastMessage } from 'hooks/useToastMesage'
import { useContext, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import {
  ExtrasInfo,
  LessonType,
  Order,
  PaymentOrigin,
  Voucher,
  VoucherExtras,
  Vouchers,
} from 'types/types'
import { fetchExtras } from 'utils/requests'
import { bestSellerItemIds, listVariants } from 'utils/utils'

interface ExtrasProps {
  origin: PaymentOrigin // Extras is purchased during lesson reservation
}

export const Extras = ({ origin }: ExtrasProps) => {
  const { showToast, isActive } = useToastMessage()
  const {
    goToNextStep,
    currentStepIndex,
    previousStepIndex,
    goToPreviousStep,
  } = useContext(FormNavigationContext)
  const { values } = useFormikContext<Order | Vouchers>()
  const isReservation = origin === PaymentOrigin.RESERVATION
  const formValues =
    isReservation && 'vouchers' in values
      ? (values as Vouchers).vouchers
      : (values as Order).lessonType

  const {
    data: extras,
    isLoading,
    isError,
  } = useQuery<ExtrasInfo[]>('extras', fetchExtras)

  const videoExtras = extras?.filter(extra => extra.type === 'video')

  const bestSellerExtraIds = bestSellerItemIds.extras

  if (isError && !isActive('extras-error'))
    showToast({
      id: 'extras-error',
      status: 'error',
      message: 'Nepodařilo se načíst produkty. Zkuste prosím později.',
    })

  const preSelectedExtrasQuantity = (formValues as LessonType[]).reduce(
    (acc, lesson) => acc + (lesson.extras?.price === 0 ? 1 : 0),
    0,
  )

  // During reservation, skip Extras step if extra was already purchased
  useEffect(() => {
    if (!isReservation) return
    const canAddExtras = !!formValues.some(
      voucher => !voucher.extras || Object.keys(voucher.extras).length === 0,
    )

    if (!canAddExtras) {
      if (previousStepIndex < currentStepIndex) goToNextStep()
      if (previousStepIndex > currentStepIndex) goToPreviousStep()
    }
  }, [
    currentStepIndex,
    isReservation,
    goToNextStep,
    goToPreviousStep,
    previousStepIndex,
  ])

  return (
    <Layout
      stepName='Videozáznam'
      title={
        origin === PaymentOrigin.ORDER
          ? 'Vzpomínka na celý život'
          : 'Dáme k tomu ještě vzpomínku?'
      }
      rightComponent={!isReservation && <Basket />}
    >
      <p className='mx-20 mt-20 text-center text-14 text-white sm:mx-44 md:mx-80 lg:mx-100 lg:mt-38 lg:text-16 xl:mx-0'>
        81% zákazníků si vyzkouší létání pouze jednou. Proto Vám doporučujeme si
        nechat natočit emoce z prvních pokusů z bezprostřední blízkosti vodního
        skútru. Takové záběry bohužel ze břehu natočit nejdou. Nebudete litovat!
      </p>

      {isLoading ? (
        <SkeletonTiles number={3} />
      ) : (
        <motion.div
          variants={listVariants}
          className='mx-20 mb-124 mt-60 flex flex-wrap justify-center gap-28 sm:mx-44 md:mx-80 lg:mx-100 xl:mx-0'
          initial='initial'
          animate='animate'
        >
          {videoExtras?.map((extra, index) => {
            if (extra.price === 0 && preSelectedExtrasQuantity === 0)
              return null // Don't show extras for free, if it was not preselected
            return (
              <ExtrasItem
                key={index}
                extra={extra}
                isBestseller={bestSellerExtraIds.includes(extra.id)}
                isReservation={isReservation}
                preSelectedExtrasQuantity={preSelectedExtrasQuantity}
              />
            )
          })}
        </motion.div>
      )}
    </Layout>
  )
}
interface ExtrasItemProps {
  extra: ExtrasInfo
  isBestseller?: boolean
  isReservation: boolean
  preSelectedExtrasQuantity: number
}

const ExtrasItem = ({
  extra,
  isBestseller,
  isReservation,
  preSelectedExtrasQuantity,
}: ExtrasItemProps) => {
  const { values, setValues } = useFormikContext<Order | Vouchers>()
  const formValues = isReservation
    ? (values as Vouchers).vouchers
    : (values as Order).lessonType

  const isSelected = formValues.some(
    lessonOrVoucher => lessonOrVoucher.extras?.id === extra.id,
  )

  const [showSelector, setShowSelector] = useState(false) // shows unselected vouchers only

  const handleExtrasClick = () => {
    if (extra.price === 0) return
    if (preSelectedExtrasQuantity === formValues.length) return
    if (formValues.length !== 1) {
      setShowSelector(!showSelector)
      return
    }
    setValues(storedValues => {
      const { extras, ...rest } = formValues[0]
      const storedFormValues = isReservation
        ? (storedValues as Vouchers).vouchers
        : (storedValues as Order).lessonType

      const accessor = isReservation ? 'vouchers' : 'lessonType'

      const newExtra = {
        id: extra.id,
        discountedPrice: extra.price,
        quantity: 1,
        name: extra.name,
      }

      if (isReservation)
        (newExtra as VoucherExtras).voucher_id = (
          storedValues as Vouchers
        ).vouchers[0].id

      // Values for Voucher Purchase
      const updatedValues = {
        ...storedValues,
        [accessor]: isSelected
          ? [rest]
          : [
              {
                ...storedFormValues[0],
                extras: newExtra,
              },
            ],
      }

      // Values for Reservation
      if (isReservation) {
        ;(updatedValues as Vouchers).order_data = {
          order_type: 'reservation',
          extras: [
            ...((storedValues as Vouchers)?.order_data?.extras ?? []),
            newExtra as VoucherExtras,
          ],
        }
      }

      return updatedValues
    })
  }

  return (
    <div className='flex flex-col'>
      <Tile
        key={extra.id}
        badgeText={isBestseller ? 'Bestseller' : ''}
        title={extra.name}
        subtitle={`${extra.price},-`}
        isSelected={isSelected}
        onClick={handleExtrasClick}
        selector={
          formValues.length !== 1 ? (
            <VoucherSelector
              extra={extra}
              showSelector={showSelector}
              closeSelector={() => setShowSelector(false)}
              isReservation={isReservation}
            />
          ) : null
        }
      />
    </div>
  )
}

interface VoucherSelectorProps {
  extra: ExtrasInfo
  showSelector: boolean
  closeSelector: () => void
  isReservation: boolean
}

const VoucherSelector = ({
  extra,
  showSelector,
  closeSelector,
  isReservation,
}: VoucherSelectorProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  useOutsideClick({
    ref: ref,
    handler: closeSelector,
  })

  const { values } = useFormikContext<Order | Vouchers>()

  const formValues =
    isReservation && 'vouchers' in values
      ? (values as Vouchers).vouchers
      : (values as Order).lessonType

  return (
    <div
      className='absolute top-[100%] z-50 mt-1 flex flex-col gap-2'
      ref={ref}
    >
      {formValues.map((lessonOrVoucher, index) => (
        <VoucherToSelect
          key={`${lessonOrVoucher.id}-${extra.id}-${'voucherName' in lessonOrVoucher && lessonOrVoucher.voucherName}`}
          index={index}
          extra={extra}
          lessonOrVoucher={lessonOrVoucher}
          showSelector={showSelector}
          isReservation={isReservation}
        />
      ))}
    </div>
  )
}

interface VoucherToSelectProps {
  extra: ExtrasInfo
  showSelector: boolean
  lessonOrVoucher: LessonType | Voucher
  index: number
  isReservation: boolean
}

const VoucherToSelect = ({
  extra,
  showSelector,
  lessonOrVoucher,
  index,
  isReservation,
}: VoucherToSelectProps) => {
  const { values, setValues } = useFormikContext<Order | Vouchers>()
  const isExtrasDisabled = extra.price === 0

  const formValues = isReservation
    ? (values as Vouchers).vouchers
    : (values as Order).lessonType

  const accessor = isReservation ? 'vouchers' : 'lessonType'

  const { extras, id } = lessonOrVoucher

  const voucherName = isReservation
    ? (lessonOrVoucher as Voucher).voucher_code
    : (lessonOrVoucher as LessonType).voucherName

  const isExtraSelectedForVoucher = lessonOrVoucher.extras?.id === extra.id

  if (
    !isExtraSelectedForVoucher &&
    !!lessonOrVoucher.extras &&
    Object.keys(lessonOrVoucher.extras).length > 0
  )
    return null // Do now show vouchers, which were selected for other extras
  if (!showSelector && !isExtraSelectedForVoucher) return null // when selector is not shown, hide only unselected vouchers (the selected ones are still shown)

  const onVoucherClick = () => {
    if (isExtrasDisabled || isExtraSelectedForVoucher) return
    setValues(storedValues => {
      const newExtra = {
        id: extra.id,
        discountedPrice: extra.price,
        quantity: 1,
        name: extra.name,
      }
      if (isReservation) {
        ;(newExtra as VoucherExtras).voucher_id = id
      }

      const lessonOrVoucherWithExtra: any = {
        ...lessonOrVoucher,
        extras: {
          id: extra.id,
          discountedPrice: extra.price,
          quantity: 1,
          name: extra.name,
        },
      }

      const updatedLessonsOrVouchers = [...formValues]
      updatedLessonsOrVouchers[index] = lessonOrVoucherWithExtra

      const updatedValues = {
        ...storedValues,
        [accessor]: updatedLessonsOrVouchers,
      }

      if (isReservation) {
        ;(updatedValues as Vouchers).order_data = {
          order_type: 'reservation',
          extras: [
            ...((storedValues as Vouchers)?.order_data?.extras ?? []),
            newExtra as VoucherExtras,
          ],
        }
      }

      return updatedValues
    })
  }

  const onRemoveClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation()
    setValues(storedValues => {
      const { extras, ...rest } = lessonOrVoucher
      const updatedLessonsOrVouchers = [...formValues]
      updatedLessonsOrVouchers[index] = rest

      let updatedValues = {
        ...storedValues,
        [accessor]: updatedLessonsOrVouchers,
      }

      if (isReservation) {
        updatedValues = {
          ...updatedValues,
          order_data: {
            order_type: 'reservation',
            extras:
              (storedValues as Vouchers).order_data?.extras.filter(
                extra =>
                  extra.voucher_id !== (extras as VoucherExtras)?.voucher_id,
              ) ?? [],
          },
        }
      }

      return updatedValues
    })
  }

  return (
    <div
      key={`${voucherName}-${id}`}
      className={clsx(
        'relative flex h-34 w-114 cursor-pointer items-center justify-center rounded text-center font-title text-22 text-base lg:w-168',
        isExtraSelectedForVoucher
          ? 'border-yellow bg-yellow text-black'
          : 'border border-yellow bg-black text-white',
      )}
      onClick={onVoucherClick}
    >
      <span>{voucherName}</span>

      {!isExtrasDisabled && extra.id === extras?.id && (
        <img
          src={cross}
          alt='Cross icon'
          className='top-50% absolute right-10'
          onClick={onRemoveClick}
        />
      )}
    </div>
  )
}
