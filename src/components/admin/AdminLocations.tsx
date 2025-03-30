import { AdminTable } from 'components/shared/AdminTable'
import { useToastMessage } from 'hooks/useToastMesage'
import { useQuery, useQueryClient } from 'react-query'
import { Branch } from 'types/types'
import { fetchBranches, updateLocation } from 'utils/requests'
import { getBranchesTableColumns } from 'utils/table-config'
import { getLocationsInitialData } from 'utils/utils'

export const AdminLocations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()

  const { data: branches } = useQuery<Branch[]>('branches', fetchBranches)
  const columns = getBranchesTableColumns(queryClient)

  const updateBranchData = async (values: Branch) => {
    try {
      await updateLocation({
        ...values,
        map_url: values.map || '',
      })
      await queryClient.invalidateQueries('branches')
      showToast({ status: 'success' })
    } catch (error: any) {
      showToast({
        status: 'error',
        message: error.message,
      })
    }
  }

  return (
    <div>
      {branches && (
        <AdminTable
          data={branches}
          columns={columns}
          isFilterable={false}
          getInitialData={getLocationsInitialData}
          updateFunction={updateBranchData}
        />
      )}
    </div>
  )
}
