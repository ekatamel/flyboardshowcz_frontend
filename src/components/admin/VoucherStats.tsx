import { useAuth } from 'context/AuthContext'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { AdminDashboardStats, Merchant } from 'types/types'
import { fetchDashboardStats, fetchMerchants } from 'utils/requests'
import { voucherStatsConfig } from 'utils/stats-config'

export const VoucherStats = () => {
  const [selectedMerchantId, setSelectedMerchantId] = useState<
    number | undefined
  >()

  const { data: dashboardStats } = useQuery<AdminDashboardStats>(
    ['dashboardStats'],
    fetchDashboardStats,
  )

  const { data: merchants } = useQuery<Merchant[]>('merchants', fetchMerchants)

  const { currentUser } = useAuth()

  const stats = selectedMerchantId
    ? dashboardStats?.merchants[selectedMerchantId]
    : dashboardStats?.total

  return (
    <>
      <select
        className='h-44 px-10 border bg-black font-body border-yellow focus:outline-none focus:border-yellow text-white block border-white rounded text-16 w-140 lg:w-300 block mb-20'
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSelectedMerchantId(Number(e.target.value))
        }
      >
        <option>Vše</option>
        {merchants?.map(merchant => (
          <option key={merchant.id} value={merchant.id}>
            {merchant.code}
          </option>
        ))}
      </select>
      <div className='flex flex-wrap gap-10 lg:gap-y-32 lg:gap-x-60'>
        {voucherStatsConfig.map(voucher => {
          const { id, title, key } = voucher
          const metric = stats?.[key]
          if (!metric) return null
          if (voucher.display === 'admin' && !currentUser?.admin) return null

          return (
            <div
              key={id}
              className='px-10 lg:p-24 w-140 lg:w-300 lg:h-127 rounded-lg bg-darkGray border border-yellow font-title flex items-center justify-between lg:block'
            >
              <p className='text-white text-14 lg:text-20'>{title}</p>
              <p className='text-yellow text-22 lg:text-37'>
                {key === 'total_paid' ? `${metric} CZK` : metric}
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}
