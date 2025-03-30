import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import stripe from 'assets/images/stripe.svg'
import { Progress } from 'components/shared/Progress'
import { FormNavigationContext as ReservationContext } from 'context/ReservationFormNavigationContext'
import { FormNavigationContext as VoucherPurchaseContext } from 'context/VoucherFormNavigationContext'
import { useFormikContext } from 'formik'
import { usePriceTotals } from 'hooks/usePriceTotals'
import { usePrompt } from 'hooks/usePrompt'
import { useToastMessage } from 'hooks/useToastMesage'
import { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { Order, PaymentOrigin, Vouchers } from 'types/types'
import { createCheckoutSession } from 'utils/requests'

import { CheckoutTable } from './CheckoutTable'

const apiKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
const stripePromise = apiKey && loadStripe(apiKey)

interface PaymentProps {
  origin: PaymentOrigin
}

export const Payment = ({ origin }: PaymentProps) => {
  const { showToast } = useToastMessage()
  usePrompt()

  const { values } = useFormikContext<Order | Vouchers>()
  const Context =
    origin === PaymentOrigin.ORDER ? VoucherPurchaseContext : ReservationContext

  const { goToNextStep, totalSteps, currentStepIndex } = useContext(Context)

  const [clientSecret, setClientSecret] = useState<string>('')

  const { totalDiscountedPrice } = usePriceTotals()

  const { mutate: createSession } = useMutation(createCheckoutSession, {
    onSuccess: data => {
      setClientSecret(data)
    },
    onError: () => {
      showToast({
        status: 'error',
      })
    },
  })

  useEffect(() => {
    if (origin === PaymentOrigin.ORDER) {
      if (!values.orderId) return
      createSession({ orderId: values.orderId, type: 'order' })
    }

    if (origin === PaymentOrigin.RESERVATION) {
      if (
        values.orderId &&
        'order_data' in values &&
        values.order_data?.extras &&
        values.order_data.extras.length > 0
      ) {
        createSession({
          orderId: values.orderId,
          type: 'reservation',
        })
      } else {
        goToNextStep()
      }
    }
  }, [createSession, goToNextStep, origin, values])

  return (
    <div className='w-screen h-fit flex flex-col-reverse lg:flex-row overflow-auto'>
      <div className='bg-black lg:w-1/2 py-60 lg:px-60 flex flex-col'>
        <div className='flex justify-between items-center mx-20 sm:mx-44 md:mx-80 lg:mx-100 xl:mx-0'>
          <h4 className='text-yellow font-title text-16 text-center lg:text-left'>
            Celková částka
          </h4>
          <div>
            <Progress value={currentStepIndex + 1} total={totalSteps} />
          </div>
        </div>

        <p className='text-yellow font-title text-50 lg:text-heading lg:mb-30 text-center lg:text-left'>
          {totalDiscountedPrice}
          ,- CZK
        </p>

        <div className='hidden lg:block'>
          <CheckoutTable
            isTotalDivider={true}
            padding='6px 0'
            origin={origin}
          />
        </div>

        {origin === PaymentOrigin.ORDER && <BankTransferDetails />}
        <div className='text-yellow text-12 font-body lg:flex mt-30 justify-center hidden'>
          <div className='flex gap-5 items-center border-r border-yellow pr-40'>
            <span>Powered by </span> <img src={stripe} alt='Stripe logo' />
          </div>
          <div className='border-l border-yellow pl-40 flex gap-22'>
            <a
              href='https://stripe.com/en-cz/legal/consumer'
              target='_blank'
              rel='noreferrer'
            >
              Terms
            </a>

            <a
              href='https://stripe.com/en-cz/privacy'
              target='_blank'
              rel='noreferrer'
            >
              Privacy
            </a>
          </div>
        </div>
      </div>

      <div className='lg:w-1/2 min-h-screen flex items-center bg-white'>
        <div id='checkout' className='w-full'>
          {clientSecret && stripePromise && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  )
}

const BankTransferDetails = () => {
  const { values } = useFormikContext<Order>()

  const { totalDiscountedPrice } = usePriceTotals()

  const base64String =
    values?.qr_code && `data:image/png;base64,${values.qr_code}`
  return (
    <div className='font-title text-center text-white mt-20 grow flex flex-col justify-center items-center'>
      <p className='text-24'>Pro platbu bankovním převodem</p>
      <div>
        <span>č. účtu: </span>
        <span className='text-yellow'>
          {process.env.REACT_APP_BANK_ACOUNT_NUMBER}
        </span>
      </div>
      <div>
        <span>Variabilní symbol: </span>
        <span className='text-yellow'>{values.variableSymbol}</span>
      </div>
      <div>
        <span>Zpráva pro příjemce: </span>
        <span className='text-yellow'>FBS</span>
      </div>
      <div>
        <span>Částka: </span>
        <span className='text-yellow'>{totalDiscountedPrice},- CZK</span>
      </div>
      {base64String && (
        <img src={base64String} alt='QR code' className='h-150 w-150 mt-20' />
      )}
    </div>
  )
}
