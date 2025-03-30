import { AdminTable } from 'components/shared/AdminTable'
import { CsvExport } from 'components/shared/CsvExport'
import { DebouncedInput } from 'components/shared/DebounceInput'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import {
  AdminVoucherResponse,
  Merchant,
  ModifiedAdminVoucher,
  Pagination,
  VoucherState,
} from 'types/types'
import { exportVouchers, fetchMerchants, fetchVouchers } from 'utils/requests'
import { getAdminVouchersTableColumns } from 'utils/table-config'
import { formatDate } from 'utils/utils'

import { ExpandableVoucherRow } from './ExpandableVoucherRow'
import { VoucherStats } from './VoucherStats'

export const AdminVouchers = () => {
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [search, setSearch] = useState('')

  const { data } = useQuery<AdminVoucherResponse>(
    ['vouchers', pagination.pageIndex, pagination.pageSize, search],
    () => fetchVouchers(pagination.pageIndex, pagination.pageSize, search),
    {
      keepPreviousData: true,
    },
  )

  const vouchers = data?.data
  const { data: merchants } = useQuery<Merchant[]>('merchants', fetchMerchants)
  const merchantsMap = new Map(
    merchants?.map(merchant => [merchant.id, merchant.code]),
  )

  const modifiedVouchers: ModifiedAdminVoucher[] | undefined = vouchers?.map(
    voucher => {
      return {
        ...voucher,
        status: VoucherState[voucher.status],
        valid_until: formatDate(voucher.valid_until),
        redeemed_date: voucher.redeemed_date
          ? formatDate(voucher.redeemed_date)
          : '-',
        merchantName: merchantsMap.get(voucher.merchant_id),
      }
    },
  )

  const columns = getAdminVouchersTableColumns()

  useEffect(() => {
    if (pagination.pageIndex === 0 || !search) return
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [search])

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h1 className='text-white font-title text-26 lg:text-subtitle text-center lg:text-left mb-16'>
          Vouchery
        </h1>
        <CsvExport mutationFn={exportVouchers} csvFileName={'vouchers.csv'} />
      </div>

      {modifiedVouchers && (
        <>
          <VoucherStats />
          <div className='flex justify-between mt-28 lg:mt-60'>
            <DebouncedInput
              value={search ?? ''}
              onChange={value => setSearch(String(value))}
              placeholder='Hledat'
            />
          </div>
          <AdminTable
            data={modifiedVouchers}
            columns={columns}
            isFilterable={true}
            isExpandable={true}
            expandedRowRender={(
              voucher: ModifiedAdminVoucher,
              toggleExpanded: () => void,
              expandedIndex: number,
            ) => (
              <ExpandableVoucherRow
                key={`${voucher.id}-${voucher.code}`}
                voucher={voucher}
                toggleExpanded={toggleExpanded}
                expandedIndex={expandedIndex}
              />
            )}
            pagination={pagination}
            setPagination={setPagination}
            totalPages={data?.pages}
            totalRecords={data?.total}
          />
        </>
      )}
    </div>
  )
}
