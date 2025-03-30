import { pdf } from '@react-pdf/renderer'
import { Cap } from 'assets/images/Cap'
import { Frisbee } from 'assets/images/Frisbee'
import { Hoodie } from 'assets/images/Hoodie'
import { Poncho } from 'assets/images/Poncho'
import { Snapback } from 'assets/images/Snapback'
import { Socks } from 'assets/images/Socks'
import { Sunglasses } from 'assets/images/Sunglasses'
import { SingleVoucher } from 'components/voucher/VoucherPDF'
import { compareAsc, format, isAfter, isSameDay } from 'date-fns'
import { FormikErrors } from 'formik'
import { FunctionComponent, SVGProps } from 'react'
import { StylesConfig } from 'react-select'
import {
  Branch,
  DiscountData,
  DiscountInfo,
  Filters,
  ModifiedAdminVoucher,
  Order,
  ReservationStatus,
  Response,
  Timeslot,
  TimeslotForVoucher,
  Voucher,
  VoucherState,
  VoucherStatus,
  VoucherType,
  Vouchers,
} from 'types/types'

import { generateAndSendVouchers, getAvailableTimeslots } from './requests'

export const sendPDFs = async (vouchers: VoucherType[]) => {
  const base64Voucher = vouchers.map(async (voucher: VoucherType) => {
    const blob = await pdf(<SingleVoucher voucher={voucher} />).toBlob()
    const reader = new FileReader()

    const base64data: string | ArrayBuffer | null = await new Promise(
      (resolve, reject) => {
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      },
    )

    return { code: voucher.code, base64: base64data }
  })

  const base64Vouchers = await Promise.all(base64Voucher)

  return generateAndSendVouchers(base64Vouchers)
}

export const merchToIconUrlMapping: Record<
  number,
  FunctionComponent<SVGProps<SVGSVGElement>>
> = {
  1: Sunglasses,
  2: Frisbee,
  3: Socks,
  4: Cap,
  5: Poncho,
  6: Hoodie,
  7: Snapback,
}

export const formatPrice = (price: number | string) => {
  return price.toLocaleString('cs-CZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const listVariants = {
  initial: {
    x: -15,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
      ease: 'linear',
    },
  },
}

export const getToastMessage = (
  status: 'success' | 'error',
  voucherApplied: boolean,
  response: Response,
) => {
  if (status === 'error') {
    return {
      title: voucherApplied
        ? 'Voucher již byl použit'
        : response.message_headline,
      description: voucherApplied
        ? 'Zadejte prosím jiný kód.'
        : response.message,
    }
  }

  return {
    title: 'Voucher byl úspěšně přidán',
    description:
      'Můžete přidat více voucherů nebo přejít dál na výběr termínu.',
  }
}

export const getToastMessageForDiscount = (
  status: 'success' | 'error',
  response: Response,
) => {
  if (status === 'error') {
    return {
      title:
        response.message_headline ||
        'Něco se pokazilo. Kontaktujte nás prosím.',
      description: response.message || '',
    }
  }

  return {
    title: response.message_headline || 'Slevový kód byl úspěšně aplikován',
    description: response.message,
  }
}

export const getDiscountDisabledMessage = (
  isLessonSelected: boolean,
  isDiscountApplied: boolean,
  noDiscountedLesson: boolean,
) => {
  if (!isLessonSelected) return 'Nejprve vyberte lekci'
  if (isDiscountApplied) return 'Lze aplikovat pouze jeden slevový kód'
  if (!noDiscountedLesson)
    return 'Slevový kód nelze aplikovat na již zlevněné lekce'
  return ''
}

export const getAvailableBranches = (
  timeslots: Timeslot[] | null,
  branches?: Branch[],
  selectedDate?: Date,
) => {
  if (!branches || !timeslots) return

  const branchIds = timeslots
    .filter(timeslot =>
      selectedDate ? isSameDay(new Date(timeslot.date), selectedDate) : true,
    )
    .map(slot => slot.branch_id)

  const uniqueBranchIdsSet = new Set(branchIds)

  return branches.filter(branch =>
    Array.from(uniqueBranchIdsSet).includes(branch.id),
  )
}

export const getAvailableDaysForBranch = (
  timeslots: Timeslot[] | null | undefined,
  branchId: number | null,
) => {
  if (!timeslots) return []

  let availableTimeslots = timeslots

  if (branchId)
    availableTimeslots = timeslots.filter(slot => slot.branch_id === branchId)

  return availableTimeslots
}

export const getFirstAvailableMonth = (dates: Date[]) => {
  if (dates && dates.length > 0) {
    const sortedDates = [...dates].sort((a, b) => compareAsc(a, b))
    return sortedDates[0]
  }

  return new Date()
}

export const getDates = (availableTimeslots: Timeslot[]) => {
  return availableTimeslots.map(timeslot => new Date(timeslot.date))
}

export const isDisabledDate = (availableDates: Date[], date: Date) => {
  return !availableDates.some(
    availableDate =>
      isSameDay(availableDate, date) &&
      (isAfter(date, new Date()) || isSameDay(date, new Date())),
  )
}

export const getTimeslots = async (
  vouchersData: Voucher[],
  setTimeslots: React.Dispatch<React.SetStateAction<Timeslot[] | null>>,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<Vouchers>>,
) => {
  const vouchers = vouchersData.map(voucher => voucher.voucher_code)
  const data = await getAvailableTimeslots(vouchers)

  setTimeslots(data.timeslots)
  setFieldValue('slots_required', data.slots_required)
}

export const getSelectedDayTimeslots = (
  availableBranchTimeslots: Timeslot[],
  selectedDay: Date,
) => {
  return availableBranchTimeslots.filter(timeslot =>
    isSameDay(new Date(timeslot.date), selectedDay),
  )
}

export const isBeforeNoon = (time: string) => {
  const [hours] = time.split(':').map(Number)
  return hours < 12
}

export const isTimeBeforeNow = (timeslot: Timeslot | TimeslotForVoucher) => {
  const [hours] = timeslot.time.split(':').map(Number)
  return (
    isSameDay(new Date(timeslot.date), new Date()) &&
    hours < new Date().getHours()
  )
}

export const formatDateToString = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}

export const getDayPickerVariants = (isBreakpoint: boolean) => {
  if (isBreakpoint)
    return {
      hidden: { x: 0 },
      visible: { x: -30 },
    }

  return {
    hidden: { x: 0 },
    visible: { x: 0 },
  }
}

export const getTimePickerVariants = (isMdBreakpoint: boolean) => {
  if (isMdBreakpoint)
    return {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    }

  return {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  }
}

export const removeDiscount = (
  values: Order,
  setValues: (
    values: React.SetStateAction<Order>,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<Order>>,
) => {
  const { discountCodeId, discountInfo, ...rest } = values
  setValues(rest)
}

export const formatDate = (date: string) => {
  return format(new Date(date), 'dd.MM.yyyy')
}

export const getPillStyles = (status: VoucherStatus) => {
  if (status === VoucherState[VoucherStatus.ACTIVE])
    return { color: '#147129', backgroundColor: '#EAFDEE' }
  if (status === VoucherState[VoucherStatus.NOT_PAID])
    return { color: '#E40000', backgroundColor: '#FFCACA' }
  if (status === VoucherState[VoucherStatus.USED])
    return { color: '#016FD0', backgroundColor: '#EDEAFD' }
  if (status === VoucherState[VoucherStatus.EXPIRED])
    return {
      color: 'rgba(72,72,72,0.9)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }
  if (
    status === VoucherState[VoucherStatus.ABSENT] ||
    status === VoucherState[VoucherStatus.CANCELLED]
  ) {
    return { color: 'white', backgroundColor: 'rgba(176, 8, 8, 1)' }
  }
  if (status === VoucherState[VoucherStatus.ONGOING]) {
    return {
      color: 'white',
      backgroundColor: '#147129',
    }
  }

  return { color: '#9E8F0B', backgroundColor: '#FFF5C3' }
}

export const filterVouchers = (
  filters: Filters | null,
  vouchers: ModifiedAdminVoucher[] | undefined,
) => {
  return vouchers?.filter(voucher => {
    if (!filters) return true

    const merchantFilter = filters.merchants.filters
    const lessonTypeFilter = filters.lessonTypes.filters
    const validityFilters = filters.validityDays.filters
    const statusFilters = filters.voucherStates.filters

    const merchantId = voucher.merchant_id
    const lessonType = voucher.lesson_type_name
    const validityDay = voucher.valid_until
    const status = voucher.status

    const merchantFilterValue = merchantFilter[merchantId]?.isSelected
    const lessonTypeFilterValue = lessonTypeFilter[lessonType]?.isSelected
    const validityFilterValue = validityFilters[validityDay]?.isSelected
    const statusFilterValue = statusFilters[status]?.isSelected

    return (
      merchantFilterValue &&
      lessonTypeFilterValue &&
      validityFilterValue &&
      statusFilterValue
    )
  })
}

export const bestSellerItemIds = {
  lessons: [5, 6],
  merch: [1, 5, 7],
  extras: [1],
}

export const getTimeSelectorPillColor = (
  isSelected: boolean,
  timeslot: Timeslot | TimeslotForVoucher,
) => {
  return isSelected
    ? 'bg-yellow'
    : isTimeBeforeNow(timeslot)
      ? 'bg-gray'
      : 'bg-white'
}

export const selectStyles: StylesConfig = {
  container: baseStyles => ({
    ...baseStyles,
    minWidth: '300px',
    width: 'fit-content',
    border: '1px solid #ffea00',
    borderRadius: '4px',
    backgroundColor: '#1F1F1F',
  }),
  control: (baseStyles, { isFocused }) => ({
    ...baseStyles,
    backgroundColor: '#1F1F1F',
    border: isFocused ? '1px solid #0056b3' : 'none',
    color: 'white',
  }),
  input: baseStyles => ({
    ...baseStyles,
    color: 'white',
  }),
  option: (baseStyles, { isFocused }) => ({
    ...baseStyles,
    backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
  }),
  menu: baseStyles => ({
    ...baseStyles,
    backgroundColor: '#1F1F1F',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
  }),
  menuList: baseStyles => ({
    ...baseStyles,
    maxHeight: '200px',
    overflowY: 'auto',
  }),
  clearIndicator: baseStyles => ({
    ...baseStyles,
    color: '#D10000',
    ':hover': {
      color: '#D10000',
    },
  }),
  multiValueRemove: baseStyles => ({
    ...baseStyles,
    color: '#1F1F1F',
    ':hover': {
      color: '#D10000',
    },
  }),
}

export const selectStylesV2: StylesConfig = {
  ...selectStyles,
  container: baseStyles => ({
    ...baseStyles,
    width: 'full',
    border: '1px solid white',
    borderRadius: '4px',
    backgroundColor: '#1F1F1F',
  }),
  control: (baseStyles, { isFocused }) => ({
    ...baseStyles,
    backgroundColor: '#000000',
    border: isFocused ? '1px solid #0056b3' : 'none',
    color: 'white',
  }),
}

export const turnToCapitalized = (text?: string) => {
  if (!text) return ''

  const lowerCaseText = text?.toLowerCase()
  return lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1)
}

export const getDiscountsInitialData = (discount: DiscountData) => {
  return {
    id: discount.id,
    discount_value: discount.discount_value,
    quantity_stock: discount.quantity_stock,
    quantity_remaining: discount.quantity_remaining,
    valid_from: discount.valid_from,
    valid_to: discount.valid_to,
  }
}

export const getLocationsInitialData = (branch: Branch) => {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address,
    lat: branch.lat,
    long: branch.long,
    map: branch.map,
  }
}

export const getRowColor = (row: any) => {
  if (row.status) return getReservationRowColor(row.status)
  if (row.active) return '#004225'
}

export const getReservationRowColor = (status: ReservationStatus) => {
  if (
    status === ReservationStatus.ABSENT ||
    status === ReservationStatus.CANCELLED
  )
    return '#7D0A0A'

  if (status === ReservationStatus.USED) return '#004225'
  if (status === ReservationStatus.ONGOING) return '#E8751A'
  if (status === ReservationStatus.TRAINED) return '#00308F'
  return 'black'
}

export const getDiscountValue = (discountInfo: DiscountInfo | undefined) => {
  if (discountInfo?.type === 'price')
    return `-${discountInfo?.discount.toFixed(0)}%`
  if (discountInfo?.type === 'min') return `+ ${discountInfo?.discount} min`
  return ''
}

export const setCookie = (name: string, value: string, days: number = 1) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000) // 3 dny
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; path=/; secure; SameSite=Strict`
}

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
