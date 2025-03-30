import { AdminTable } from 'components/shared/AdminTable'
import { useToastMessage } from 'hooks/useToastMesage'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { AdminDiscountsResponse, DiscountData, Pagination } from 'types/types'
import { fetchDiscounts, updateDiscount } from 'utils/requests'
import { getDiscountsTableColumns } from 'utils/table-config'
import { getDiscountsInitialData } from 'utils/utils'

export const AdminDiscounts = () => {
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  })

  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()

  const { data } = useQuery<AdminDiscountsResponse>(
    ['discounts', pagination.pageIndex, pagination.pageSize],
    () => fetchDiscounts(pagination.pageIndex, pagination.pageSize),
    {
      keepPreviousData: true,
    },
  )
  const discounts = data?.data
  const columns = getDiscountsTableColumns(queryClient)

  const updateDiscountData = async (values: DiscountData) => {
    try {
      await updateDiscount(values)
      await queryClient.invalidateQueries('discounts')
      showToast({ status: 'success' })
    } catch (error: any) {
      showToast({
        status: 'error',
        message: error.message,
      })
    }
  }

  return (
    <div className='w-full'>
      {discounts && (
        <AdminTable
          data={discounts}
          columns={columns}
          isFilterable={false}
          getInitialData={getDiscountsInitialData}
          updateFunction={updateDiscountData}
          pagination={pagination}
          setPagination={setPagination}
          totalPages={data?.meta.total_pages}
          totalRecords={data?.meta.total_items}
        />
      )}
    </div>
  )
}
