import clsx from 'clsx'
import { AdminButton } from 'components/shared/AdminButton'
import { format, parseISO } from 'date-fns'
import { Form, useFormikContext } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  AdminOrder,
  AdminOrderPostType,
  ExtrasInfo,
  Response,
} from 'types/types'
import { getOrderFormFields } from 'utils/form-config'
import { fetchExtras } from 'utils/requests'

import { AddAdditionalInfo } from './AddAdditionalInfo'
import { AddCustomer } from './AddCustomer'
import { AddExtras } from './AddExtras'
import { AddLesson } from './AddLesson'
import { AddMerch } from './AddMerch'
import { AddMinutes } from './AddMinutes'
import { AddPayment } from './AddPayment'
import { AddPurchaseTypes } from './AddPurchaseTypes'

interface NewOrderFormProps {
  onClose: () => void
  addCustomers: boolean
  mutatitonFn: (order: AdminOrderPostType) => Promise<any>
}

export const NewOrderForm = ({
  onClose,
  addCustomers,
  mutatitonFn,
}: NewOrderFormProps) => {
  const { data: extras } = useQuery<ExtrasInfo[]>('extras', fetchExtras)

  const minutesExtra = extras?.find(extra => extra.type === 'minutes')

  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()
  const { values, errors, touched } = useFormikContext<AdminOrder>()

  const orderFormFields = getOrderFormFields()
  // TODO make 2 separate functions
  const postNewAdminOrder = (values: AdminOrder) => {
    const isExtrasAddedOrder =
      values.customer.id && values.voucher_id && values.purchaseType.minutes
    const orderData: AdminOrderPostType = {
      order_data: {
        total_amount: values.payment.total_amount,
        payment_type: values.payment.payment_type,
        customer: {},
      },
    }

    if (isExtrasAddedOrder) {
      orderData.order_data.voucher_id = values.voucher_id
      orderData.order_data.customer = {
        id: values.customer.id,
      }
      orderData.order_data.order_type = 'extras'
    } else {
      orderData.action = 'create_order'
      orderData.order_data.customer = {
        first_name: values.customer.first_name,
        last_name: values.customer.last_name,
        email: values.customer?.email,
        phone_number: values.customer?.phone_number ?? null,
        gdpr: true,
        know_from: 'On site',
        instagram: values.customer?.instagram ?? null,
      }
      orderData.order_data.order_type = values.purchaseType.lekce
        ? 'voucher'
        : 'shop'
      orderData.order_data.message = values.info?.message ?? null
    }

    if (values.lesson && values.purchaseType.lekce) {
      orderData.order_data.lessonType = [
        {
          code: values.lesson.code,
        },
      ]
    }
    if (values.merch && values.purchaseType.merch) {
      orderData.order_data.merch = [
        {
          id: Number(values.merch.id),
          quantity: 1,
        },
      ]
      if (values.merch?.size)
        orderData.order_data.merch[0].size = values.merch.size
    }

    // Pridat validation na to ze branch_id a datum a cas musi byt posilany spolu
    if (values.extras && values.purchaseType.video) {
      orderData.order_data.extras = [values.extras, values.minutes].filter(
        Boolean,
      ) as { id: number; quantity: number }[]
    }

    if (values.lesson?.branch_id || values.lesson?.datetime) {
      orderData.reservation_data = {}
      if (values.lesson?.branch_id)
        orderData.reservation_data.branch_id = Number(values.lesson.branch_id)
      if (values.lesson?.datetime) {
        const dateObject = parseISO(values.lesson.datetime)
        const date = format(dateObject, 'yyyy-MM-dd')
        const time = format(dateObject, 'HH:mm')
        orderData.reservation_data.date = date
        orderData.reservation_data.time = time
      }
    }

    createNewOrder(orderData)
  }

  const { mutate: createNewOrder, isLoading } = useMutation(mutatitonFn, {
    onSuccess: async data => {
      const status = [200, 201].includes(data.code) ? 'success' : 'error'
      if (status === 'success') {
        showToast({
          status: 'success',
          message: 'Objednávka byla úspěšně vytvořena',
        })
        onClose()
        await queryClient.invalidateQueries('reservations')
        await queryClient.invalidateQueries('reservationsForDay')
      } else {
        showToast({
          status: 'error',
          message: data.message,
        })
      }
    },
    onError: (data: Response) => {
      showToast({
        status: 'error',
        message: data.message_headline,
      })
    },
  })

  const isSubmitDisabled =
    Object.keys(errors).length > 0 ||
    isLoading ||
    Object.keys(touched).length === 0

  return (
    <>
      <Form>
        {addCustomers && (
          <>
            <AddCustomer customerFields={orderFormFields.customer} />
            <AddPurchaseTypes />
          </>
        )}

        <div className='flex justify-between mt-40'>
          {values.purchaseType.lekce && orderFormFields.lesson && (
            <AddLesson lessonFields={orderFormFields.lesson} />
          )}

          <div
            className={clsx(
              values.purchaseType.minutes ? 'flex gap-20' : 'w-[42%]',
            )}
          >
            {values.purchaseType.minutes &&
              orderFormFields.minutes &&
              minutesExtra && (
                <AddMinutes
                  fields={orderFormFields.minutes}
                  minutesExtra={minutesExtra}
                />
              )}
            {values.purchaseType.video && orderFormFields.extras && (
              <AddExtras
                extrasFields={orderFormFields.extras}
                extras={extras}
                minutesExtraId={minutesExtra?.id}
              />
            )}

            {values.purchaseType.merch && orderFormFields.merch && (
              <AddMerch merchFields={orderFormFields.merch} />
            )}
          </div>
        </div>

        <AddPayment paymentFields={orderFormFields.payment} />
        {addCustomers && <AddAdditionalInfo />}
      </Form>

      <div className='flex gap-20 justify-between mb-16 mt-20'>
        <AdminButton
          title='Zrušit'
          className='bg-black border-yellow text-yellow'
          onClick={onClose}
        />
        <AdminButton
          title='Uložit'
          className='bg-yellow border-yellow text-black'
          disabled={isSubmitDisabled}
          onClick={() => postNewAdminOrder(values as any)}
        />
      </div>
    </>
  )
}
