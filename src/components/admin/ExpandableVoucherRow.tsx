import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import { AdminButton } from 'components/shared/AdminButton'
import { DateInput } from 'components/shared/DateInput'
import { isSameDay, parse } from 'date-fns'
import { useToastMessage } from 'hooks/useToastMesage'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import {
  ModifiedAdminVoucher,
  UpdatedVoucher,
  VoucherState,
  VoucherStateReversed,
} from 'types/types'
import { updateVoucher } from 'utils/requests'
import { formatDate, formatDateToString } from 'utils/utils'

interface ExpandableVoucherRowProps {
  voucher: ModifiedAdminVoucher
  toggleExpanded: () => void
  expandedIndex: number
}

export const ExpandableVoucherRow = ({
  voucher,
  toggleExpanded,
  expandedIndex,
}: ExpandableVoucherRowProps) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()

  const {
    reservation,
    created_date,
    redeemed_date,
    valid_until,
    status,
    purchased_by,
  } = voucher

  const validUntilDateValue = parse(valid_until, 'dd.MM.yyyy', new Date())
  const reedemedDateValue =
    redeemed_date && redeemed_date !== '-'
      ? parse(redeemed_date, 'dd.MM.yyyy', new Date())
      : null
  const [redeemedAt, setRedeemedAt] = useState<Date | null>(reedemedDateValue)
  const [validUntil, setValidUntil] = useState<Date>(validUntilDateValue)
  const [voucherStatus, setVoucherStatus] = useState<string>(status)

  const { mutate: updateVoucherInfo, isLoading } = useMutation(updateVoucher, {
    onSuccess: async data => {
      if (data.code === 200) {
        await queryClient.invalidateQueries('vouchers')
        toggleExpanded()
        showToast({ status: 'success' })
      } else {
        showToast({
          status: 'error',
          message: data.message,
        })
      }
    },
    onError: (error: any) => {
      showToast({
        status: 'error',
        message: error.message,
      })
    },
  })

  const cancelChanges = () => {
    setRedeemedAt(reedemedDateValue)
    setValidUntil(validUntilDateValue)
    setVoucherStatus(status)
    toggleExpanded()
  }

  const updateVoucherData = async () => {
    const updatedVoucherData: UpdatedVoucher = {
      voucherId: voucher.id,
    }

    if (voucherStatus !== status)
      updatedVoucherData.status = VoucherStateReversed[voucherStatus]

    if (!isSameDay(validUntil, validUntilDateValue))
      updatedVoucherData.valid_until = formatDateToString(validUntil)
    if (
      redeemedAt &&
      !isSameDay(redeemedAt, new Date(reedemedDateValue ?? '-'))
    )
      updatedVoucherData.redeemed_date = formatDateToString(redeemedAt)

    if (Object.keys(updatedVoucherData).length === 1) {
      toggleExpanded()
      return
    }

    updateVoucherInfo(updatedVoucherData)
  }

  useEffect(() => {
    setRedeemedAt(reedemedDateValue)
    setValidUntil(validUntilDateValue)
    setVoucherStatus(status)
  }, [expandedIndex])

  return (
    <div className='flex flex-col gap-12 lg:gap-30 lg:pt-22 lg:px-10 lg:pb-10'>
      <div className='flex'>
        <p className='font-title text-yellow w-120'></p>
        <div className='flex gap-30'>
          <DateInput
            label={'Uplatněno dne'}
            date={redeemedAt}
            setDate={setRedeemedAt}
          />
          <DateInput
            label={'Platnost do'}
            date={validUntil}
            setDate={setValidUntil}
          />
          <div className='flex flex-col gap-16'>
            <span className='font-title text-yellow text-14 lg:text-16'>
              Vytvořeno
            </span>
            <span className='text-14 lg:text-16'>
              {formatDate(created_date)}
            </span>
          </div>
          <FormControl>
            <FormLabel
              htmlFor='select-voucher-status'
              className='text-yellow'
              fontSize={{
                base: 14,
                lg: 16,
              }}
            >
              Stav
            </FormLabel>
            <Select
              borderColor={'#ffea00'}
              onChange={e => setVoucherStatus(e.target.value)}
              value={voucherStatus}
              fontSize={{
                base: 14,
                lg: 16,
              }}
            >
              <option value='' disabled>
                Vyber stav
              </option>
              {Object.values(VoucherState).map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      {purchased_by && (
        <div className='flex'>
          <p className='font-title text-yellow text-14 lg:text-16 w-60 lg:w-120 shrink-0'>
            Koupil
          </p>
          <div className='flex gap-30'>
            <div className='flex flex-col'>
              <p className='font-title text-yellow text-14 lg:text-16'>Jméno</p>
              <p className='text-14 lg:text-16'>{purchased_by.first_name}</p>
            </div>
            <div className='flex flex-col'>
              <p className='font-title text-yellow text-14 lg:text-16'>
                Příjmení
              </p>
              <p className='text-14 lg:text-16'>{purchased_by.last_name}</p>
            </div>
            <div className='flex flex-col'>
              <p className='font-title text-yellow text-14 lg:text-16'>
                Telefon
              </p>
              <p className='text-14 lg:text-16'>{purchased_by.phone_number}</p>
            </div>
            <div className='flex flex-col'>
              <p className='font-title text-yellow text-14 lg:text-16'>Email</p>
              <p className='text-14 lg:text-16'>{purchased_by.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className='flex'>
        <p className='font-title text-yellow text-14 shrink-0 lg:text-16 w-60 lg:w-120'>
          Rezervace
        </p>
        {reservation?.id && (
          <div className='text-14 lg:text-16'>{reservation?.id}</div>
        )}
      </div>
      <div className='flex gap-20 justify-end'>
        <AdminButton
          title='Zrušit'
          className='bg-black border-yellow text-yellow'
          onClick={() => cancelChanges()}
        />
        <AdminButton
          title='Uložit'
          className='bg-yellow border-yellow text-black'
          onClick={() => updateVoucherData()}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
