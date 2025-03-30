import {
  AdminLesson,
  AdminOrderPostType,
  Branch,
  Discount,
  DiscountData,
  NewTimeslot,
  NewUser,
  OrderPostType,
  UpdatedReservationData,
  UpdatedTimeslots,
  UpdatedVoucher,
  VouchersPostType,
} from 'types/types'

import axios from './axios-instance'
import { formatDateToString } from './utils'

export const fetchLessonConfiguration = async () => {
  const response = await axios.get('api/lessons/lessonsConfiguration')
  return response.data
}

export const fetchLessons = async () => {
  const response = await axios.get('api/lessons')
  return response.data
}

export const validateDiscountCode = async (discountCode: string) => {
  const response = await axios.post(
    `api/discount/apply-discount/${discountCode}`,
  )
  return response.data
}

export const createOrder = async (order: OrderPostType) => {
  const response = await axios.post('api/orders', order, {})
  return response.data
}

export const fetchOrder = async (orderId: string) => {
  const response = await axios.get(`api/orders/${orderId}`)
  return response.data
}

export const fetchExtras = async () => {
  const response = await axios.get('api/extras')
  return response.data
}

export const fetchMerch = async () => {
  const response = await axios.get('api/merch')
  return response.data
}

export const fetchKnowFrom = async () => {
  const response = await axios.get('api/knowfrom')
  return response.data
}

export const createCheckoutSession = async ({
  type,
  orderId,
}: {
  type: 'order' | 'reservation'
  orderId: number
}) => {
  const response = await axios.post('api/create-checkout-session', {
    orderId,
    type,
  })
  return await response.data
}

export const retrieveCheckoutSession = async (sessionId: string | null) => {
  if (!sessionId) return

  const params = {
    session_id: sessionId,
  }

  const response = await axios.get('api/session-status', { params })

  return await response.data
}

export const generateAndSendVouchers = async (
  vouchers: { code: string; base64: string | ArrayBuffer | null }[],
) => {
  const response = await axios.post('api/voucher-generation-pdf', {
    vouchers,
  })

  return await response.data
}

export const postSuccessfulPayment = async (orderId: number) => {
  const response = await axios.post('api/payments/card-payment-successfull', {
    order_id: orderId,
    status: 'OK',
  })

  return await response.data
}

export const validateVoucher = async (voucherCode: string) => {
  const response = await axios.post('api/vouchers-validation', {
    voucher_code: voucherCode,
    action: 'validity_check',
  })

  return await response.data
}

export const getAvailableTimeslots = async (vouchers: string[]) => {
  const response = await axios.post('api/timeslots', {
    vouchers,
  })

  return response.data
}

export const fetchBranches = async () => {
  const response = await axios.get('api/branch')
  return response.data
}

export const createReservation = async (vouchersInfo: VouchersPostType) => {
  const response = await axios.post('api/reservations', {
    ...vouchersInfo,
  })

  return await response.data
}

export const fetchDiscounts = async (pageIndex: number, pageSize: number) => {
  const response = await axios.get(
    `api/discount?page=${pageIndex + 1}&per_page=${pageSize}`,
  )
  return response.data
}

export const fetchTimeslots = async () => {
  const response = await axios.get('api/timeslots')
  return response.data.data
}

export const fetchVouchers = async (
  pageIndex: number,
  pageSize: number,
  search: string,
) => {
  const response = await axios.get(
    `api/vouchers?page=${pageIndex + 1}&per_page=${pageSize}${search ? `&search=${search}` : ''}`,
  )
  return response.data
}

export const exportVouchers = async () => {
  const response = await axios.post('api/export/vouchers')
  return response
}

export const fetchReservations = async (
  targetDate?: Date,
  selectedBranchId?: number | null,
) => {
  let apiUrl = 'api/reservations?'
  if (targetDate) apiUrl += `target_date=${formatDateToString(targetDate)}`
  if (selectedBranchId)
    apiUrl += `${targetDate ? '&' : ''}branch_id=${selectedBranchId}`

  const response = await axios.get(apiUrl)
  return response.data
}

export const fetchReservationDays = async () => {
  const response = await axios.get('/api/reservations/summary')
  return response.data.branches
}

export const fetchMerchants = async () => {
  const response = await axios.get('api/merchants')
  return response.data.data
}

export const fetchLectors = async () => {
  const response = await axios.get('api/lectors')
  return response.data.data
}

export const fetchDashboardStats = async () => {
  const response = await axios.get('api/admin/dashboard')
  return response.data
}

export const deleteDiscount = async (discountId: number) => {
  await axios.delete(`api/discount/${discountId}`)
}

export const deleteBranch = async (branchId: number) => {
  await axios.delete(`api/branch/${branchId}`)
}

export const deleteDayTimeslots = async (queryParams: {
  date: string
  branch_id: number
}) => {
  await axios.delete(`api/timeslotgenerator`, {
    params: queryParams,
  })
}

export const updateTimeslots = async (updatedTimeslot: UpdatedTimeslots) => {
  const response = await axios.put('api/timeslots', updatedTimeslot)

  return await response.data
}

export const updateVoucher = async (voucherData: UpdatedVoucher) => {
  const { voucherId, ...rest } = voucherData
  const response = await axios.put(`api/vouchers/${voucherId}`, {
    ...rest,
  })

  return await response.data
}

export const updateReservation = async (
  reservationData: UpdatedReservationData,
) => {
  const response = await axios.put(`api/admin/orders`, {
    ...reservationData,
  })

  return await response.data
}

export const updateDiscount = async (discountData: DiscountData) => {
  const { id, ...rest } = discountData
  const response = await axios.put(`api/discount/${id}`, {
    ...rest,
  })

  return await response.data
}

export const updateLocation = async (locationData: any) => {
  const { id, ...rest } = locationData
  const response = await axios.put(`api/branch/${id}`, {
    ...rest,
  })

  return await response.data
}

export const createDiscount = async (discount: Omit<Discount, 'id'>) => {
  const response = await axios.post('api/discount', discount)
  return response.data
}

export const createBranch = async (branch: Omit<Branch, 'id'>) => {
  const response = await axios.post('api/branch', branch)
  return response.data
}

export const createTimeslot = async (timeslot: NewTimeslot) => {
  const response = await axios.post('api/timeslotgenerator', timeslot)
  return response.data
}

export const createAdminOrder = async (order: AdminOrderPostType) => {
  const response = await axios.post('api/admin/orders', order)
  return response.data
}

export const addNewExtrasForReservation = async (order: AdminOrderPostType) => {
  const response = await axios.post('api/admin/add_extras', order)
  return response.data
}

export const loginUser = async (loginData: {
  username: string
  password: string
}) => {
  const response = await axios.post('/api/users/login', loginData)
  return response.data
}

export const registerUser = async (newUser: NewUser) => {
  const response = await axios.post('/api/users/register', newUser)
  return response.data
}

export const validateToken = async (username: string, access_token: string) => {
  const response = await axios.post(
    '/api/users/validate_token',
    { username },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  )
  return response.data
}

export const getApiKey = async () => {
  const response = await axios.get('api/api-key')
  return response.data
}

export const getDomainVerificationFile = async () => {
  const response = await axios.get(
    '/.well-known/apple-developer-merchantid-domain-association',
  )
  return response.data
}

export const exportCustomers = async () => {
  const response = await axios.post('api/export/customers')
  return response
}

export const updateLesson = async (
  updatedLesson: Omit<AdminLesson, 'bullet_points_description'> & {
    bullet_points_description: Record<string, string> | null
  },
) => {
  const { id: lessonId, ...rest } = updatedLesson
  const response = await axios.put(`api/lessons/${lessonId}`, {
    ...rest,
  })

  return response.data
}

export const createLesson = async (
  newLesson: Omit<AdminLesson, 'bullet_points_description'> & {
    bullet_points_description: Record<string, string> | null
  },
) => {
  const response = await axios.post(`api/lessons`, newLesson)
  return response.data
}

export const deleteLesson = async (lessonId: number) => {
  const response = await axios.delete(`api/lessons/${lessonId}`)
  return response
}
