import { Table, TableContainer, Tbody } from '@chakra-ui/react'
import { Layout } from 'components/shared/Layout'
import { TableHead } from 'components/shared/TableHead'
import { TableRow } from 'components/shared/TableRow'
import { useFormikContext } from 'formik'
import { useCreateOrder } from 'hooks/useCreateOrder'
import { Order } from 'types/types'

import { CheckoutTable } from './CheckoutTable'

export const Summary = () => {
  const { values } = useFormikContext<Order>()

  const { createAndSendOrder, isLoading } = useCreateOrder()

  return (
    <Layout
      stepName='Shrnutí'
      title='Nemáme tam chybu?'
      onNextStepClick={createAndSendOrder}
      isNextDisabled={isLoading}
    >
      <TableContainer
        overflowY={'auto'}
        className='mx-20 sm:mx-44 md:mx-80 lg:mx-100 xl:mx-0 md:mt-40 xl:mt-0 box-border'
      >
        <Table className='flex lg:table'>
          <TableHead
            data={['Jméno a příjmení', 'Email', 'Telefonní číslo']}
            padding='16px 0'
            className='flex flex-col lg:table-row border-t border-yellow xl:border-none h-121 lg:h-fit border-b'
            noBorder={true}
          />
          <Tbody className='w-full'>
            <TableRow
              key={'user'}
              data={[
                `${values.customer.first_name} ${values.customer.last_name}`,
                values.customer.email || '',
                values.customer.phone_number || '',
              ]}
              className='text-16 lg:text-20 text-white flex flex-col lg:table-row border-t border-yellow xl:border-none border-b h-121 lg:h-fit'
              padding='16px 0'
            />
          </Tbody>
        </Table>
      </TableContainer>

      <div className='flex mx-20 sm:mx-44 md:mx-80 lg:mx-100 xl:mx-0 py-10 xl:py-0'>
        <p className='font-title text-textGray text-16 mr-30 xl:mr-40 my-20 whitespace-nowrap'>
          Jména na voucher
        </p>
        <div className='flex flex-wrap xl:pl-24 lg:pt-10 xl:gap-60 w-full gap-10'>
          {values.lessonType.map((lesson, index) => {
            const { voucherName, name } = lesson
            return (
              <div
                key={`${lesson.id}-${index}`}
                className='font-title flex lg:flex-col gap-10 lg:gap-0 items-center'
              >
                <span className='lg:text-20 text-16 text-white'>
                  {voucherName}
                </span>
                <span className='text-yellow text-12'>({name})</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className='mx-20 sm:mx-44 md:mx-80 lg:mx-100 xl:mx-0'>
        <CheckoutTable
          isHeader={true}
          className={'text-16 lg:text-20'}
          isTotalDivider={true}
          padding='16px 0'
        />
      </div>

      <p className='text-darkerGray font-title my-34 xl:my-10 text-right ml-auto text-12 mx-20 sm:mx-44 md:mx-80 lg:mx-100 xl:mx-0'>
        Stisknutím tlačítka “Dokončit a zaplatit” souhlasíte se{' '}
        <a
          href='https://www.flyboardshow.cz/gdpr'
          target='_blank'
          rel='noreferrer'
          className='underline'
        >
          zpracováním osobních údajů a s obecnými podmínkami užití
        </a>
      </p>
    </Layout>
  )
}
