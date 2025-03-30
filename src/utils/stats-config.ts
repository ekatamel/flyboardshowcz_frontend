interface StatsConfig {
  id: number
  title: string
  key: 'not_used_vouchers' | 'used_vouchers' | 'total' | 'total_paid'
  display?: 'admin'
}

export const voucherStatsConfig: StatsConfig[] = [
  {
    id: 1,
    title: 'Nevyužito voucherů',
    key: 'not_used_vouchers',
  },
  {
    id: 2,
    title: 'Využito voucherů',
    key: 'used_vouchers',
  },
  {
    id: 3,
    title: 'Celkem voucherů',
    key: 'total',
  },
  {
    id: 4,
    title: 'Celkem zaplaceno',
    key: 'total_paid',
    display: 'admin',
  },
]
