import { useFormikContext } from 'formik'
import { Order, Vouchers } from 'types/types'
import { formatPrice } from 'utils/utils'

export const usePriceTotals = () => {
  const { values } = useFormikContext<Order | Vouchers>()

  let totalPrice = 0
  let totalDiscountedPrice = 0
  let totalDiscountValue = 0

  if ('lessonType' in values) {
    const totalLessonsPrice = values.lessonType.reduce(
      (acc, lesson) => acc + (lesson.discountedPrice ?? lesson.price),
      0,
    )

    // Extras from Order (voucher purchase)
    const totalOrderExtrasPrice = values.lessonType.reduce((acc, lesson) => {
      if (!lesson.extras) return acc
      return acc + (lesson.extras.discountedPrice ?? lesson.extras.price)
    }, 0)

    const totalMerchPrice =
      values.merch?.reduce((acc, merch) => {
        return acc + merch.discountedPrice * merch.quantity
      }, 0) || 0

    totalPrice = totalLessonsPrice + totalOrderExtrasPrice + totalMerchPrice

    totalDiscountValue =
      values.discountCodeId && values.discountInfo?.type === 'price'
        ? totalLessonsPrice * (values.discountInfo.discount / 100)
        : 0

    totalDiscountedPrice = totalPrice - totalDiscountValue
  }

  if ('order_data' in values) {
    // Extras from Reservations
    totalDiscountedPrice =
      values.order_data?.extras.reduce(
        (acc, extra) => acc + extra.discountedPrice,
        0,
      ) || 0
  }

  return {
    totalPrice: formatPrice(totalPrice),
    totalDiscountedPrice: formatPrice(totalDiscountedPrice),
    discountValue: formatPrice(totalDiscountValue),
  }
}
