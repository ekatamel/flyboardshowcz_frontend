export interface Lesson {
  bullet_points_description?: Record<string, string>
  description: string | null
  discount: number | null
  discounted_price: number
  extras: Extras[]
  id: number
  lesson_type_code: string
  lesson_type_name: string
  merch: MerchInfo[]
  price: number | null
  product_code: string
  product_code_stripe: string
  showtocustomer_from?: string
  showtocustomer_to?: string
  top_level_description: string
  validity_voucher_from: string
  validity_voucher_to: string
  product?: Product
  active: boolean
  type_lesson: 'flyboard' | 'other'
}

export interface AdminLesson {
  id: number
  lesson_type_name: string
  type_lesson: 'flyboard' | 'other'
  product_code_stripe: string
  price: number
  discount: number
  bullet_points_description: string | null
  top_level_description: string
  showtocustomer_from: string
  showtocustomer_to: string
  validity_voucher_from: string
  validity_voucher_to: string
  length: number
  description: string | null
  merchant_id: number
  lesson_type_code: string | null
}

export interface Product {
  id: number
  description: string
  length: number
  merchant_id: number
  product_code: string
  product_name: string
  valid_from: string
  valid_to: string
}

export interface Order {
  orderId: number
  variableSymbol: string
  qr_code: string
  hasVoucher: boolean
  lessonType: LessonType[]
  discountCodeId?: number
  discountInfo?: DiscountInfo
  closestValidDate?: string
  customer: Customer
  merch?: Merch[]
}

export interface DiscountInfo {
  code: string
  discount: number
  type: string
}

export interface OrderPostType {
  order_data: {
    order_type: 'voucher' | 'shop'
    lessonType: Omit<LessonType, 'name' | 'validTill'>[]
    discounts?: {
      discount_type: string
      discount_id: number
    }
    customer: Customer
    merch: Merch[]
    message: string
  }
}

export interface Customer {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  gdpr?: boolean
  know_from?: string
  instagram?: string
  contact_person: 1 | 0
}

export interface LessonType {
  id: number
  name: string
  code: string
  price: number | null
  discountedPrice: number
  discount: number | null
  voucherName: string
  validTill: string
  extras?: Extras
  merch?: MerchInfo[]
}

export interface Extras {
  id: number
  price?: number
  discountedPrice: number
  name: string
  quantity: number
}

export interface ExtrasInfo {
  id: number
  name: string
  price: number
  quantity: number
  product_code_stripe: string
  type: 'video' | 'minutes'
}

// Merch type for Order
export interface Merch {
  id: number
  discountedPrice: number
  name: string
  quantity: number
  size?: string
}

// Merch type info from DB
export interface MerchInfo {
  id: number
  name: string
  price: number
  product_code_stripe: string
  available_sizes: Record<string, string>
  quantity: number
  size?: string // Size selected for preselected Merch
}

export interface KnowFrom {
  know_from: string
}

export interface VoucherType {
  code: string
  created_date: string
  id: number
  lesson_type_code: string
  merchant_id: number
  order_id: number
  price: number
  redeemed_date: null
  status: string
  valid_until: string
  voucher_name: string
  lesson_type_name: string
}

export interface ContactFormFields {
  label: string
  name: keyof Customer
  type: 'text' | 'select' | 'checkbox' | 'number' | 'date'
  placeholder?: string
  included: boolean
  required?: boolean
}
export interface FormFields {
  label: string
  name: string
  type:
    | 'text'
    | 'select'
    | 'checkbox'
    | 'number'
    | 'date'
    | 'time'
    | 'multi-select'
    | 'datetime-local'
  placeholder?: string
  included: boolean
  required?: boolean
  options?: { value: string; label: string }[]
}

export interface Response {
  code: number
  message: string
  message_headline: string
}

export interface Vouchers {
  orderId: number
  vouchers: Voucher[]
  date: string
  branch_id: number
  branch_name: string
  time: string
  slots_required: number
  timeslot_id: number
  order_data?: {
    order_type: 'reservation'
    extras: {
      id: number
      discountedPrice: number
      quantity: number
      name: string
      voucher_id: number
    }[]
  }
}

export interface Voucher {
  lesson_name: string
  length: number
  merchant: string
  valid_until: string
  voucher_code: string
  customer: Customer
  extras?: VoucherExtras
  id: number
}

export interface VoucherExtras extends Extras {
  voucher_id: number
  is_order_paid?: boolean
}

export interface Extras {
  id: number
  price?: number
  discountedPrice: number
  name: string
  quantity: number
}

export interface Branch {
  address: string
  id: number
  lat: number
  long: number
  name: string
  map: string | null
}

export interface TimeslotForVoucher {
  available_time_slots: number
  total_time_slots: number
  branch_id: number
  date: string
  time: string
  timeslot_id: number
  is_active: boolean
  lecturers: Lecturer[]
}

export interface Timeslot extends TimeslotForVoucher {
  id: number
}

export interface Lecturer {
  id: number
  name: string
}

export interface VoucherPostType {
  code: string
  customer: Customer
}

export interface VouchersPostType {
  vouchers: VoucherPostType[]
  date: string
  branch_id: number
  time: string
  slots_required: number
  timeslot_id: number
  order_data?: {
    order_type: 'reservation'
    extras: any
    customer: any
  }
}

export interface Discount {
  discount_code: string
  discount_description: null | string
  discount_type: string
  discount_value: number
  id: number
  quantity_remaining: number
  quantity_stock: number
  valid_from: string
  valid_to: string
}

export interface AdminDiscountsResponse {
  data: Discount[]
  meta: {
    page: number
    per_page: number
    total_items: number
    total_pages: number
  }
}

export interface PaginatedResponse {
  has_next: boolean
  has_prev: boolean
  page: number
  pages: number
  total: number
}

export interface AdminVoucherResponse extends PaginatedResponse {
  data: AdminVoucher[]
}

export interface AdminVoucher {
  code: string
  created_date: string
  id: number
  length: number
  lesson_type_code: string
  lesson_type_name: string
  merchant_id: number
  order_id: number
  price: number
  redeemed_date: null | string
  status: VoucherStatus
  valid_until: string
  voucher_name: string
  reservation: {
    id: number
  }
  merchantName: string | undefined
  purchased_by?: CustomerDetail
}

export interface CustomerDetail {
  created_date: string
  email: string
  first_name: string
  gdpr: boolean
  id: number
  instagram: null | string
  know_from: string
  last_modification_date: string
  last_name: string
  phone_number: string
}

export enum VoucherStatus {
  RESERVED = 'Reserved',
  NOT_PAID = 'Waiting_For_Payment',
  USED = 'Used',
  ACTIVE = 'Active',
  ONGOING = 'Ongoing',
  CANCELLED = 'Cancelled',
  ABSENT = 'Absent',
  EXPIRED = 'Expired',
}

export enum ReservationStatus {
  RESERVED = 'Reserved',
  USED = 'Used',
  ONGOING = 'Ongoing',
  CANCELLED = 'Cancelled',
  ABSENT = 'Absent',
  TRAINED = 'Trained',
}

export interface ModifiedAdminVoucher extends Omit<AdminVoucher, 'status'> {
  status: (typeof VoucherState)[keyof typeof VoucherState]
}

export const VoucherState = {
  [VoucherStatus.RESERVED]: 'Rezervováno',
  [VoucherStatus.NOT_PAID]: 'Nezaplaceno',
  [VoucherStatus.USED]: 'Uplatněn',
  [VoucherStatus.ACTIVE]: 'Aktivní',
  [VoucherStatus.ONGOING]: 'Na místě',
  [VoucherStatus.CANCELLED]: 'Zrušeno',
  [VoucherStatus.ABSENT]: 'Absence',
  [VoucherStatus.EXPIRED]: 'Expiroval',
}

export const VoucherStateReversed = {
  [VoucherState[VoucherStatus.RESERVED]]: VoucherStatus.RESERVED,
  [VoucherState[VoucherStatus.NOT_PAID]]: VoucherStatus.NOT_PAID,
  [VoucherState[VoucherStatus.USED]]: VoucherStatus.USED,
  [VoucherState[VoucherStatus.ACTIVE]]: VoucherStatus.ACTIVE,
  [VoucherState[VoucherStatus.ABSENT]]: VoucherStatus.ABSENT,
  [VoucherState[VoucherStatus.CANCELLED]]: VoucherStatus.CANCELLED,
  [VoucherState[VoucherStatus.ONGOING]]: VoucherStatus.ONGOING,
  [VoucherState[VoucherStatus.EXPIRED]]: VoucherStatus.EXPIRED,
}

export const ReservationState = {
  [ReservationStatus.USED]: 'Uplatněn',
  [ReservationStatus.TRAINED]: 'Odškoleno',
  [ReservationStatus.ONGOING]: 'Na místě',
  [ReservationStatus.RESERVED]: 'Rezervováno',
  [ReservationStatus.CANCELLED]: 'Zrušeno',
  [ReservationStatus.ABSENT]: 'Absence',
}

export interface Merchant {
  active_from: string
  active_to: string
  code: string
  id: number
  name: string
}

export interface Filters {
  [key: string]: {
    title: string
    filters: {
      [key: string]: {
        label: string
        isSelected: boolean
      }
    }
  }
}

export interface TimeInfo {
  timeslotId: number
  time: string
  isActive: boolean
  isReserved: boolean
  lecturers: Lecturer[]
}

export interface TimeslotsByDayAndTime {
  [branch_id: number]: {
    [date: string]: {
      branch_id: number
      scooters: number
      lecturers: Lecturer[]
      timeslots: TimeInfo[]
    }
  }
}

export interface TimeslotsByDay {
  branch_id: number
  date: string
  scooters: number
  lecturers: Lecturer[]
  timeslots: TimeInfo[]
}

export interface Lector {
  email: string
  first_name: string
  id: number
  last_name: string
  nickname: string
  phone_number: null | string
}

export interface UpdatedTimeslots {
  date: string
  branch_id: number
  timeslots: {
    lectors: { id: number }[]
    timeslot_id: number
    is_active: boolean
  }[]
}

export interface UpdatedVoucher {
  voucherId: number
  redeemed_date?: string
  valid_until?: string
  status?: string
}

export interface ReservationMetrics {
  merch: {
    merch_bought_today: number
    total_merch: number
  }
  minutes: {
    extra_minutes_today: number
    total_minutes: number
  }
  money: {
    card: number
    cash: number
    qr: number
    total: number
  }
  videos: {
    total_videos: number
    videos_bought_today: number
  }
  vouchers: {
    total_vouchers: number
    walkins: number
  }
}

export interface ReservationData {
  data: Reservation[]
  metrics: ReservationMetrics
}

export interface Reservation {
  extras?: {
    id: number
    name: string
    is_order_paid: boolean
    type: 'video' | 'minutes'
  }[]
  code: string
  created_date: string
  free_min_generated: boolean
  id: number
  length: number
  lesson_length: number
  lesson_type_code: string
  lesson_type_name: string
  merchant_id: number
  message: null | string
  order_id: number
  merch?: ReservationMerch[]
  price: number
  redeemed_date: string | null
  reservation: ReservationDetails
  status: `${ReservationStatus}`
  used_by: CustomerDetail
  valid_until: string
  voucher_name: string
  vouchers_count_on_order: number
}

export interface ReservationMerch {
  id: number
  merch_id: number
  name: string
  order_id: number
  price: number
  quantity: number
  size: null | string
}

export interface ReservationDetails {
  branch_id: number
  contact_person: number
  created_date: string
  date: string
  email_sent: boolean
  id: number
  message: null | string
  reservation_from: string
  status: string
  time: string
  timeslot_id: number
}

export interface UpdatedReservationData {
  customer_data: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone_number: string
    instagram: string | null
  }
  voucher_data?: {
    id: number
    message: string | null
    status: `${ReservationStatus}`
  }
}

export interface UpdatedReservation {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  instagram: string | null
  message: string | null
  status: `${ReservationStatus}`
}

export interface DiscountData {
  id: number
  discount_value?: number
  quantity_stock?: number
  quantity_remaining?: number
  valid_from?: string
  valid_to?: string
}

export enum TabId {
  Discounts = 1,
  Locations = 2,
  Availability = 3,
}

export enum DiscountType {
  PRICE = 'Cena',
  MIN = 'Minuty',
}

export interface NewTimeslot {
  date: string
  lecturers?: number[]
  scooters: number
  branch_id: number
  start_hour: number
  end_hour: number
  lunch_start?: number
  lunch_end?: number
}

// API POST type
export interface AdminOrderPostType {
  action?: 'create_order'
  order_data: {
    lessonType?: { code: string }[]
    total_amount: number
    payment_type: 'cash'
    order_type?: 'voucher' | 'shop' | 'extras'
    message?: string | null
    customer: {
      id?: number
      first_name?: string
      last_name?: string
      email?: string
      phone_number?: string | null
      gdpr?: true
      know_from?: 'On site'
      instagram?: string | null
    }
    voucher_id?: number
    merch?: {
      id: number
      quantity: 1
      size?: string
    }[]
    extras?: {
      id: number
      quantity: number
    }[]
  }
  reservation_data?: {
    date?: string
    branch_id?: number
    time?: string
  }
}

export interface PurchaseType {
  lekce: boolean
  video: boolean
  merch: boolean
  minutes: boolean
}

export interface AdminOrder {
  purchaseType: PurchaseType
  voucher_id?: number
  payment: {
    payment_type: 'cash'
    total_amount: 0
  }
  lesson: {
    datetime: string
    branch_id: number
    code: string
  }
  customer: {
    id?: number
    first_name: string
    last_name: string
    email?: string
    phone_number?: string
    instagram?: string
  }
  extras?: {
    id: number
    quantity: number
  }
  merch?: {
    id: number
    size?: string
  }
  minutes?: {
    id: number
    quantity: number
  }
  info?: {
    message: string
  }
}

export interface NewUser {
  username: string
  email: string
  phone_number: string
  first_name: string
  last_name: string
  password: string
  confirm_password: string
}

export interface AuthenticatedUser {
  username: string
  access_token: string
  admin: boolean
}

export interface UpdateReservation {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  instagram: string | null
  message: string | null
  status: 'Reserved' | 'Used' | 'Ongoing' | 'Cancelled' | 'Absent' | 'Entered'
}

export enum PaymentOrigin {
  ORDER = 'Order',
  RESERVATION = 'Reservation',
}

export enum ProductType {
  LESSON = 'lessonType',
  MERCH = 'merch',
  EXTRAS = 'extras',
  DISCOUNT = 'discount',
}

export interface Pagination {
  pageIndex: number
  pageSize: number
}

export interface DashboardStat {
  not_used_vouchers: number
  total: number
  used_vouchers: number
  total_paid?: number
}

export interface AdminDashboardStats {
  merchants: Record<string, DashboardStat>
  total: DashboardStat
}

export interface ReservationDaysByBranch {
  branch_id: number
  reserved_dates: string[]
}
