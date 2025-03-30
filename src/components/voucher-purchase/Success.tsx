import team from 'assets/images/team.jpeg'
import { Button } from 'components/shared/Button'
import { Layout } from 'components/shared/Layout'
import { LoadingSpinner } from 'components/shared/LoadingSpinner'
import VoucherPDFLink from 'components/voucher/VoucherPDFLink'
import { useEffect } from 'react'
import { useMutation, useQuery } from 'react-query'
import { PaymentOrigin } from 'types/types'
import {
  fetchOrder,
  postSuccessfulPayment,
  retrieveCheckoutSession,
} from 'utils/requests'

interface SuccessProps {
  origin: PaymentOrigin
}

export const Success = ({ origin }: SuccessProps) => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const sessionId = urlParams.get('session_id')

  const { data: session, isLoading } = useQuery(
    'session',
    () => retrieveCheckoutSession(sessionId),
    {
      enabled: !!sessionId,
    },
  )

  const { data: order } = useQuery(
    'order',
    () => fetchOrder(session?.client_reference_id),
    {
      enabled: !!session?.client_reference_id,
    },
  )

  const { mutate: sendPayment } = useMutation(postSuccessfulPayment)

  useEffect(() => {
    if (session?.status === 'complete' && order && order.status !== 'Paid') {
      sendPayment(order.id)
    }
  }, [order, session?.status, sendPayment])

  return (
    <Layout
      stepName=''
      isLoading={isLoading}
      title={origin === PaymentOrigin.ORDER ? 'Máš zaplaceno' : 'Těšíme se'}
      middleComponent={
        <Button
          title='Flyboardshow.cz'
          variant='primary'
          position='center'
          link={'https://www.flyboardshow.cz/'}
          isLoading={isLoading}
          className='mt-20'
        />
      }
      noNavigation={isLoading}
      noProgress={true}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {origin === PaymentOrigin.ORDER && (
            <div className='mx-20 flex flex-wrap items-center justify-center gap-20 sm:mx-44 md:mx-80 lg:mx-100 lg:flex-nowrap lg:justify-between xl:mx-0'>
              <p className='font-20 text-white'>
                Rezervuj si svůj let na flyboardshow.cz
              </p>
              <div className='flex gap-40'>
                <div className='flex h-30 w-fit items-center justify-center bg-yellow px-24 py-6 font-title text-black'>
                  <a href='/rezervace'>Rezervovat</a>
                </div>
                {order && order.vouchers.length > 0 && (
                  <div className='flex h-30 w-fit items-center justify-center whitespace-nowrap bg-yellow px-24 py-6 font-title text-black'>
                    <VoucherPDFLink vouchers={order.vouchers} />
                  </div>
                )}
              </div>
            </div>
          )}
          {origin === PaymentOrigin.RESERVATION && (
            <p className='mb-40 mt-20 px-20 text-center text-14 text-white sm:px-44 md:px-80 lg:mt-38 lg:px-100 lg:text-16 xl:mt-10 xl:px-0'>
              Do emailu jsme Ti poslali potvrzení o rezervaci. Na lekci doraž 10
              minut před začátkem. S sebou plavky, ručník a dobrou náladu :).
            </p>
          )}

          <img
            src={team}
            alt='Team'
            className='mt-24 w-full object-cover px-20 sm:px-44 md:px-80 lg:h-[50vh] lg:px-100 xl:px-0'
          />
          <p className='mx-20 mt-20 text-right font-title text-14 text-white sm:mx-44 md:mx-80 lg:mx-100 lg:text-20 xl:mx-0'>
            Já i celý Flyboard Show tým se na Tebe těšíme u vody!
          </p>
          <p className='mx-20 text-right font-title text-14 text-white sm:mx-44 md:mx-80 lg:mx-100 lg:text-20 xl:mx-0'>
            Petr Civín
          </p>
        </>
      )}
    </Layout>
  )
}
