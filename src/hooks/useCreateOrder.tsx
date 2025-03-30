import { FormNavigationContext } from 'context/VoucherFormNavigationContext'
import { useFormikContext } from 'formik'
import { useContext } from 'react'
import { useMutation } from 'react-query'
import { Order, OrderPostType, PaymentOrigin } from 'types/types'
import { createOrder } from 'utils/requests'
import { sendPDFs } from 'utils/utils'

import { useGroupedProducts } from './useGroupedProducts'
import { useToastMessage } from './useToastMesage'

export const useCreateOrder = () => {
  const { showToast } = useToastMessage()

  const { preselectedMerch } = useGroupedProducts(PaymentOrigin.ORDER)

  const { values, setFieldValue } = useFormikContext<Order>()
  const { goToNextStep } = useContext(FormNavigationContext)

  const { mutate: sendNewOrder, isLoading } = useMutation(createOrder, {
    onSuccess: data => {
      setFieldValue('orderId', data.id)
      setFieldValue('variableSymbol', data.payment_info.variable_symbol)
      setFieldValue('qr_code', data.payment_info.qr_code)

      if (data.vouchers) sendPDFs(data.vouchers)

      goToNextStep()
    },
    onError: (error: any) => {
      showToast({ status: 'error', message: error.message })
    },
  })

  const createAndSendOrder = () => {
    const order: OrderPostType = {
      order_data: {
        order_type: 'voucher',
        customer: {
          ...values.customer,
          gdpr: true,
        },
        discounts: {
          discount_type: values.discountInfo?.type || '',
          discount_id: values.discountCodeId || 0,
        },
        merch: [...(values.merch ?? []), ...(preselectedMerch ?? [])],
        message: '',
        lessonType: values.lessonType.map(lesson => {
          return {
            id: lesson.id,
            code: lesson.code,
            price: lesson.price,
            discountedPrice: lesson.discountedPrice ?? lesson.price,
            discount: lesson.discount,
            voucherName: lesson.voucherName,
            extras: lesson.extras,
          }
        }),
      },
    }
    return sendNewOrder(order)
  }

  return { createAndSendOrder, isLoading }
}
