import { useFormikContext } from 'formik'
import {
  Extras,
  LessonType,
  Merch,
  Order,
  PaymentOrigin,
  ProductType,
  Vouchers,
} from 'types/types'

export const useGroupedProducts = (origin: PaymentOrigin) => {
  const { values } = useFormikContext<Order | Vouchers>()

  let allProducts = []
  let preselectedMerch = null

  if (origin === PaymentOrigin.ORDER) {
    const orderValues = values as Order
    const groupedLessons = orderValues.lessonType.reduce(
      (
        acc: Record<
          number,
          LessonType & { quantity: number; type: ProductType.LESSON }
        >,
        lesson,
      ) => {
        if (!acc[lesson.id])
          acc[lesson.id] = {
            ...lesson,
            quantity: 0,
            type: ProductType.LESSON,
          }
        acc[lesson.id].quantity++
        return acc
      },
      {},
    )

    // Pre-selected merch with specific lesson
    const groupedPreselectedMerch = orderValues.lessonType.reduce(
      (
        acc: Record<
          number,
          Merch & { quantity: number; type: ProductType.MERCH }
        >,
        lesson,
      ) => {
        lesson['merch']?.forEach(merch => {
          if (!acc[merch.id])
            acc[merch.id] = {
              ...merch,
              discountedPrice: merch.price,
              quantity: 0,
              type: ProductType.MERCH,
            }

          acc[merch.id].quantity++
        })

        return acc
      },
      {},
    )

    preselectedMerch = Object.values(groupedPreselectedMerch)

    // Pre-selected extras with lesson & added extras on top
    const groupedExtras = orderValues.lessonType.reduce(
      (
        acc: Record<
          number,
          Extras & { quantity: number; type: ProductType.EXTRAS }
        >,
        lesson,
      ) => {
        if (!lesson.extras) return acc
        if (!acc[lesson.extras.id])
          acc[lesson.extras.id] = {
            ...lesson.extras,
            type: ProductType.EXTRAS,
            quantity: 0,
            // TODO correct type
            discountedPrice:
              lesson.extras.discountedPrice || lesson.extras.price || 0,
          }
        acc[lesson.extras.id].quantity++
        return acc
      },
      {},
    )

    allProducts = [
      ...Object.values(groupedLessons),
      ...Object.values(groupedExtras),
      ...Object.values(groupedPreselectedMerch),
      ...(orderValues.merch?.map(merch => ({
        ...merch,
        type: ProductType.MERCH,
      })) ?? []),
    ]
  } else {
    const reservationValues = values as Vouchers
    allProducts =
      reservationValues.order_data?.extras.map(extra => ({
        ...extra,
        type: ProductType.EXTRAS,
      })) ?? []
  }

  return { allProducts, preselectedMerch }
}
