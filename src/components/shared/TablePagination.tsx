import { Select } from '@chakra-ui/react'
import clsx from 'clsx'
import { Pagination } from 'types/types'

import { AdminButton } from './AdminButton'

interface TablePaginationProps<T extends object> {
  pagination: Pagination
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
  totalPages?: number
  totalRecords?: number
}

export const TablePagination = <T extends object>({
  pagination,
  setPagination,
  totalPages,
  totalRecords,
}: TablePaginationProps<T>) => {
  const currentPage = pagination.pageIndex + 1

  return (
    <div className='flex justify-between mt-30 lg:mt-20 items-center gap-10 sticky left-0'>
      <AdminButton
        title='Předchozí'
        onClick={() =>
          setPagination(prev => ({
            ...prev,
            pageIndex: prev.pageIndex - 1,
          }))
        }
        disabled={currentPage <= 1}
      />

      <div className='flex items-center gap-20'>
        <p className='font-title text-white text-center text-14 lg:text-16 hidden lg:block'>
          Stránka {currentPage} z {totalPages} ({totalRecords} položek)
        </p>
        <RecordsSelect pagination={pagination} setPagination={setPagination} />
      </div>

      <AdminButton
        title='Další'
        onClick={() =>
          setPagination(prev => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
          }))
        }
        disabled={currentPage >= (totalPages ?? 0)}
      />
    </div>
  )
}

interface RecordsSelectProps {
  pagination: Pagination
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
}

const RecordsSelect = ({ pagination, setPagination }: RecordsSelectProps) => {
  return (
    <div className={clsx('flex items-center gap-10')}>
      <span className='font-title text-white text-center text-14 lg:text-16'>
        Počet:
      </span>
      <Select
        value={pagination.pageSize}
        onChange={e => {
          setPagination(prev => ({
            ...prev,
            pageSize: Number(e.target.value),
            pageIndex: 0, // reset pages
          }))
        }}
        borderColor={'#ffea00'}
        className='text-white font-title'
      >
        {[5, 10, 20, 30, 40, 50, 100].map(pageSize => (
          <option
            key={pageSize}
            value={pageSize}
            className='text-14 lg:text-16'
          >
            {pageSize}
          </option>
        ))}
      </Select>
    </div>
  )
}
