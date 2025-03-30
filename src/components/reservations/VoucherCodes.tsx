import { Table, TableContainer, Tbody } from '@chakra-ui/react'
import { Layout } from 'components/shared/Layout'
import { LoadingSpinner } from 'components/shared/LoadingSpinner'
import { TableHead } from 'components/shared/TableHead'
import { TableRow } from 'components/shared/TableRow'
import { TextInput } from 'components/shared/TextInput'
import { useFormikContext } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Response, Vouchers } from 'types/types'
import { validateVoucher } from 'utils/requests'
import { getToastMessage } from 'utils/utils'

import { Button } from '../shared/Button'

export const VoucherCodes = () => {
  const navigate = useNavigate()
  const { showToast } = useToastMessage()

  const [value, setValue] = useState('')

  const { setFieldValue, values } = useFormikContext<Vouchers>()

  const { mutate: validate, isLoading } = useMutation(validateVoucher, {
    onSuccess: data => {
      const voucherApplied = values.vouchers?.find(
        voucher => voucher.voucher_code === data.voucher?.voucher_code,
      )

      const status = data.code === 200 && !voucherApplied ? 'success' : 'error'

      if (status === 'success') {
        setFieldValue('vouchers', [
          ...(values.vouchers ?? []),
          { ...data.voucher, code: data.voucher.voucher_code },
        ])
        setValue('')
      }

      const toastMessage = getToastMessage(status, !!voucherApplied, data)

      showToast({
        status,
        message: toastMessage.title,
        description: toastMessage.description,
        duration: status === 'success' ? 4000 : 10000,
      })
    },
    onError: (data: Response) => {
      showToast({
        status: 'error',
        message: data.message_headline,
        duration: 10000,
      })
    },
  })

  const hasVerifiedVouchers = values.vouchers && values.vouchers.length > 0

  return (
    <Layout
      stepName='Voucher'
      title='Kód voucheru'
      onPreviosStepClick={() => navigate('/')}
      isNextDisabled={!hasVerifiedVouchers}
    >
      <p className='text-white mt-20 xl:mt-10 lg:mt-38 text-14 lg:text-16 text-center px-20 sm:px-44 md:px-80 lg:px-100 xl:px-0'>
        Zadejte svůj kód, který naleznete na vytištěném voucheru nebo v emailu a
        stiskněte &quot;Ověřit&quot;. Ujistětě, že je kód správný a připravte se
        na vzrušující zážitek nad vodní hladinou.
      </p>

      <div className='flex gap-20 lg:gap-100 mt-40 lg:mt-100 justify-center items-center px-20 sm:px-44 md:px-80 xl:px-0 flex-wrap sm:flex-nowrap mb-20'>
        <TextInput
          className='w-full h-44 text-14'
          value={value}
          setValue={setValue}
          placeholder={'Kód voucheru'}
        />
        <Button
          title='Ověřit'
          type='submit'
          variant='primary'
          disabled={!value || isLoading}
          onClick={() => validate(value)}
          isRounded={false}
          className='lg:w-200'
        />
      </div>

      {isLoading && <LoadingSpinner />}

      {values.vouchers && values.vouchers.length > 0 && !isLoading && (
        <TableContainer
          overflowY={'auto'}
          className='px-20 sm:px-44 md:px-80 xl:px-0 md:mt-40'
        >
          <Table className='lg:table'>
            <TableHead
              data={['Kód voucheru', 'Typ lekce', 'Doba trvání', 'Portál']}
            />
            <Tbody>
              {values.vouchers.map(voucher => {
                const { voucher_code, length, lesson_name, merchant } = voucher
                return (
                  <TableRow
                    key={voucher_code}
                    data={[
                      voucher_code,
                      lesson_name,
                      `${length} min`,
                      merchant,
                    ]}
                    className={'text-16 lg:text-20 text-white'}
                    onDelete={() => {
                      setFieldValue(
                        'vouchers',
                        values.vouchers?.filter(
                          voucher => voucher.voucher_code !== voucher_code,
                        ),
                      )
                    }}
                  />
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  )
}
