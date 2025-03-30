import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { AccordionButton, AccordionIcon } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import checkmark from 'assets/images/checkmark.svg'
import crossIcon from 'assets/images/cross-icon.svg'
import save from 'assets/images/save.png'
import { AxiosResponse } from 'axios'
import { Pill } from 'components/shared/Pill'
import { Field } from 'formik'
import { QueryClient, UseMutateFunction } from 'react-query'
import {
  Branch,
  Discount,
  Lesson,
  Merchant,
  ModifiedAdminVoucher,
  Reservation,
  ReservationState,
  TimeslotsByDay,
  VoucherStatus,
} from 'types/types'

import { deleteBranch, deleteDiscount } from './requests'
import { formatDate, formatPrice, getPillStyles } from './utils'

export const getAdminVouchersTableColumns = () => {
  const columnHelper = createColumnHelper<ModifiedAdminVoucher>()

  return [
    columnHelper.accessor('order_id', {
      header: 'Č. obj.',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('merchantName', {
      header: 'Od',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('code', {
      header: 'Kód',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('voucher_name', {
      id: 'voucher_name',
      header: 'Jméno na voucher',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('lesson_type_name', {
      header: 'Typ lekce',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('valid_until', {
      header: 'Platnost do',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('redeemed_date', {
      header: 'Uplatněno dne',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('status', {
      header: 'Stav',
      cell: info => {
        return (
          <Pill
            text={info.getValue()}
            style={getPillStyles(info.getValue() as VoucherStatus)}
            className='font-normal h-30'
          />
        )
      },
    }),
    columnHelper.display({
      id: 'AccordionButton',
      header: '',
      size: 0,
      cell: () => {
        return (
          <AccordionButton>
            <AccordionIcon />
          </AccordionButton>
        )
      },
    }),
  ]
}

export const getDiscountsTableColumns = (queryClient: QueryClient) => {
  const columnHelper = createColumnHelper<Discount>()

  return [
    columnHelper.accessor('discount_code', {
      header: 'Kód',
      enableSorting: true,
      size: 200,
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('discount_type', {
      header: 'Typ slevy',
      enableSorting: true,
      size: 200,
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('discount_value', {
      header: 'Sleva',
      enableSorting: true,
      size: 200,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none text-white block font-title border-none'
            type='number'
            name='discount_value'
          />
        )
      },
    }),
    columnHelper.accessor('quantity_stock', {
      header: 'Počet',
      enableSorting: true,
      size: 300,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none text-white block font-title border-none'
            type='number'
            name='quantity_stock'
          />
        )
      },
    }),
    columnHelper.accessor('quantity_remaining', {
      header: 'Zbývá',
      enableSorting: true,
      size: 200,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='number'
            name='quantity_remaining'
          />
        )
      },
    }),
    columnHelper.accessor('valid_from', {
      header: 'Platnost od',
      enableSorting: true,
      size: 200,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='date'
            name='valid_from'
          />
        )
      },
    }),
    columnHelper.accessor('valid_to', {
      header: 'Platnost do',
      enableSorting: true,
      size: 200,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='date'
            name='valid_to'
          />
        )
      },
    }),
    columnHelper.accessor('id', {
      id: 'delete',
      enableSorting: false,
      header: '',
      cell: info => (
        <div className='flex gap-20 items-center justify-end'>
          <button type='submit' className='shrink-0'>
            <img src={save} alt='Save icon' className='w-18 h-18' />
          </button>
          <DeleteIcon
            className={'cursor-pointer'}
            onClick={async () => {
              await deleteDiscount(info.row.original.id)
              await queryClient.invalidateQueries('discounts')
            }}
          />
        </div>
      ),
    }),
  ]
}

export const getBranchesTableColumns = (queryClient: QueryClient) => {
  const columnHelper = createColumnHelper<Branch>()

  return [
    columnHelper.accessor('name', {
      header: 'Název',
      enableSorting: true,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='string'
            name='name'
          />
        )
      },
    }),
    columnHelper.accessor('address', {
      header: 'Adresa',
      enableSorting: true,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='string'
            name='address'
          />
        )
      },
    }),
    columnHelper.accessor('long', {
      header: 'Long',
      enableSorting: true,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='number'
            name='long'
          />
        )
      },
    }),
    columnHelper.accessor('lat', {
      header: 'Lat',
      enableSorting: true,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='number'
            name='lat'
          />
        )
      },
    }),
    columnHelper.accessor('map', {
      header: 'Google maps URL',
      enableSorting: true,
      cell: () => {
        return (
          <Field
            className='w-full px-10 py-4 max-w-169 bg-transparent focus:outline-none  text-white block font-title border-none'
            type='text'
            name='map'
          />
        )
      },
    }),
    columnHelper.accessor('id', {
      id: 'delete',
      enableSorting: false,
      header: '',
      cell: info => (
        <div className='flex gap-20 items-center justify-end'>
          <button type='submit' className='shrink-0'>
            <img src={save} alt='Save icon' className='w-18 h-18' />
          </button>
          <DeleteIcon
            className={'cursor-pointer'}
            onClick={async () => {
              await deleteBranch(info.row.original.id)
              await queryClient.invalidateQueries('branches')
            }}
          />
        </div>
      ),
    }),
  ]
}

export const getAvailabilityTableColumns = () => {
  const columnHelper = createColumnHelper<TimeslotsByDay>()

  return [
    columnHelper.accessor('date', {
      header: 'Datum',
      enableSorting: true,
      size: 300,
      cell: info => <div>{formatDate(info.getValue())}</div>,
    }),
    columnHelper.accessor('lecturers', {
      header: 'Lektoří',
      enableSorting: true,
      size: 300,
      cell: info => {
        return (
          <div>
            {info
              .getValue()
              .map(lecturer => lecturer.name)
              .join(', ')}
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'From',
      header: 'Od',
      size: 300,
      cell: info => {
        const timeslots = info.row.original.timeslots
        const sortedTimeslots = timeslots.sort((a, b) => {
          return a.time.localeCompare(b.time)
        })
        return <div>{sortedTimeslots[0].time}</div>
      },
    }),
    columnHelper.display({
      id: 'Until',
      header: 'Do',
      size: 300,
      cell: info => {
        const timeslots = info.row.original.timeslots
        const sortedTimeslots = timeslots.sort((a, b) => {
          return a.time.localeCompare(b.time)
        })
        return <div>{sortedTimeslots[timeslots.length - 1].time}</div>
      },
    }),
    columnHelper.accessor('scooters', {
      header: 'Počet skútrů',
      enableSorting: true,
      size: 300,
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.display({
      id: 'AccordionButton',
      header: '',
      size: 0,
      cell: () => {
        return (
          <AccordionButton>
            <AccordionIcon />
          </AccordionButton>
        )
      },
    }),
  ]
}

export const getReservationsTableColumns = () => {
  const columnHelper = createColumnHelper<Reservation>()

  return [
    columnHelper.accessor('used_by', {
      header: 'Zákazník',
      enableSorting: true,
      size: 300,
      cell: info => {
        const customer = info.row.original.used_by
        if (customer)
          return <div>{`${customer.first_name} ${customer.last_name}`}</div>
        return <div></div>
      },
    }),
    columnHelper.accessor('lesson_length', {
      header: 'Min',
      enableSorting: true,
      size: 300,
      cell: info => {
        const lessonLength = info.getValue()
        const extras = info.row.original.extras
        const extraMinutes =
          extras?.reduce((acc: number, extra) => {
            if (extra.type === 'minutes') acc = acc + 5 // 5 minutes
            return acc
          }, 0) ?? 0
        return <div>{lessonLength + extraMinutes}</div>
      },
    }),
    columnHelper.accessor('extras', {
      header: 'Video',
      enableSorting: true,
      size: 300,
      cell: info => {
        const extras = info.row.original.extras
        const hasVideo = !!extras?.find(extra => extra.type === 'video')
        return (
          <img
            src={hasVideo ? checkmark : crossIcon}
            alt={hasVideo ? 'Video available' : 'No video available'}
          />
        )
      },
    }),
    columnHelper.accessor('reservation.time', {
      header: 'Čas',
      enableSorting: true,
      size: 300,
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('status', {
      header: 'Stav',
      enableSorting: true,
      size: 300,
      cell: info => {
        const reservationStatus = info.getValue()
        return <div>{ReservationState[reservationStatus]}</div>
      },
    }),
    columnHelper.accessor('merch', {
      header: 'Merch',
      enableSorting: true,
      size: 300,
      cell: info => {
        const merch = info.row.original.merch
        return (
          <img
            src={merch && merch.length > 0 ? checkmark : crossIcon}
            alt='Merch available icon'
          />
        )
      },
    }),
    columnHelper.display({
      id: 'AccordionButton',
      header: '',
      size: 0,
      cell: () => {
        return (
          <AccordionButton>
            <AccordionIcon />
          </AccordionButton>
        )
      },
    }),
  ]
}

export const getAdminLessonsTableColumns = (
  deleteAdminLesson: UseMutateFunction<
    AxiosResponse<any, any>,
    any,
    number,
    unknown
  >,
  merchantsMap: Map<number, Merchant>,
  onEditClick: (lesson: Lesson) => void,
) => {
  const columnHelper = createColumnHelper<Lesson>()

  return [
    columnHelper.accessor('lesson_type_name', {
      header: 'Název',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('product.product_code', {
      header: 'Produktový kód',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('product.length', {
      header: 'Délka',
      cell: info => <div>{info.getValue()} min</div>,
    }),
    columnHelper.accessor('price', {
      header: 'Cena',
      cell: info => {
        const price = info.getValue()
        if (!price) return '-'
        return <div>{formatPrice(price)}</div>
      },
    }),
    columnHelper.accessor('discount', {
      header: 'Sleva',
      cell: info => {
        if (!info.getValue()) return '-'
        return <div>{`${info.getValue()} %`}</div>
      },
    }),
    columnHelper.accessor('product.merchant_id', {
      header: 'Merchant',
      cell: info => {
        const merchantCode = merchantsMap.get(info.getValue())?.code
        if (!merchantCode) return '-'
        return <div>{merchantCode}</div>
      },
    }),
    columnHelper.accessor('showtocustomer_from', {
      header: 'Ukazovat od',
      cell: info => {
        const showFrom = info.getValue()
        if (!showFrom) return '-'
        return <div>{formatDate(showFrom)}</div>
      },
    }),
    columnHelper.accessor('showtocustomer_to', {
      header: 'Ukazovat do',
      cell: info => {
        const showTo = info.getValue()
        if (!showTo) return '-'
        return <div>{formatDate(showTo)}</div>
      },
    }),
    columnHelper.accessor('validity_voucher_from', {
      header: 'Validita do',
      cell: info => <div>{formatDate(info.getValue())}</div>,
    }),
    columnHelper.accessor('validity_voucher_to', {
      header: 'Validita do',
      cell: info => <div>{formatDate(info.getValue())}</div>,
    }),
    columnHelper.display({
      id: 'AccordionButton',
      header: '',
      size: 0,
      cell: info => {
        return (
          <div className='flex gap-20 items-center justify-end'>
            <EditIcon
              className={'cursor-pointer'}
              onClick={() => onEditClick(info.row.original)}
            />
            <DeleteIcon
              className={'cursor-pointer'}
              onClick={() => deleteAdminLesson(info.row.original.id)}
            />
          </div>
        )
      },
    }),
  ]
}
