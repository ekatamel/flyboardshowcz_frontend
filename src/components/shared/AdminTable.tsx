import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Table,
  TableContainer,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import clsx from 'clsx'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Pagination } from 'types/types'
import { getRowColor } from 'utils/utils'

import { TablePagination } from './TablePagination'

interface AdminTableProps<T extends object> {
  data: T[]
  columns: ColumnDef<T, any>[]
  isFilterable?: boolean
  isExpandable?: boolean
  expandedRowRender?: (
    row: any,
    toggleExpanded: () => void,
    expandedIndex: number,
  ) => JSX.Element
  getInitialData?: (row: T) => Partial<T>
  updateFunction?: (values: T) => void
  pagination?: Pagination
  setPagination?: React.Dispatch<React.SetStateAction<Pagination>>
  totalPages?: number
  totalRecords?: number
}

export const AdminTable = <T extends object>({
  data,
  columns,
  isExpandable = false,
  expandedRowRender,
  getInitialData,
  updateFunction,
  pagination,
  setPagination,
  totalPages,
  totalRecords,
}: AdminTableProps<T>) => {
  const [expandedIndex, setExpandedIndex] = useState<number>(-1)

  const handleChange = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index)
  }

  const table = useReactTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <TableContainer className='mt-30'>
      <Accordion allowToggle index={expandedIndex} onChange={handleChange}>
        <Table>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      color={'#ffea00'}
                      fontFamily={'Bebas Neue'}
                      fontSize={{
                        base: '16px',
                        lg: '18px',
                      }}
                      fontWeight={'normal'}
                      borderColor={'#ffea00'}
                      padding={'8px 12px'}
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </Thead>

          {table.getRowModel().rows.map((row, index) => {
            return (
              <AccordionItem
                className='text-white font-title text-18 border-none'
                display={'table-row-group'}
                key={row.id}
              >
                {({ isExpanded }) => {
                  const initialValues: any = getInitialData
                    ? getInitialData(row.original)
                    : {}

                  const rowColor = getRowColor(row.original)

                  return (
                    <Formik
                      initialValues={initialValues}
                      onSubmit={values =>
                        updateFunction ? updateFunction(values as T) : undefined
                      }
                    >
                      {({ values }) => {
                        return (
                          <>
                            <Form
                              style={{
                                display: 'table-row',
                                backgroundColor: rowColor,
                              }}
                              className={clsx(rowColor, 'cursor-pointer')}
                              onClick={() => handleChange(index)}
                            >
                              {row.getVisibleCells().map(cell => {
                                const cellId = cell.column.id

                                return (
                                  <Td
                                    style={{
                                      display: 'table-cell',
                                    }}
                                    key={cell.id}
                                    borderColor={'#ffea00'}
                                    borderBottom={
                                      isExpanded ? 'none' : '1px solid #ffea00'
                                    }
                                    padding={{
                                      base: '2px 8px',
                                      lg: '8px 12px',
                                    }}
                                    fontSize={{
                                      base: '16px',
                                      lg: '18px',
                                    }}
                                    className={clsx(
                                      initialValues[cellId] !==
                                        values[cellId] && 'bg-gray',
                                    )}
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </Td>
                                )
                              })}
                            </Form>
                            {isExpandable && index === expandedIndex && (
                              <Tr>
                                <Td
                                  colSpan={columns.length}
                                  padding={0}
                                  border={'none'}
                                  className='border-b border-yellow'
                                >
                                  <AccordionPanel
                                    className='bg-darkGray border-b border-yellow'
                                    key={`item-${row.id}`}
                                  >
                                    {expandedRowRender &&
                                      expandedRowRender(
                                        row.original,
                                        () => handleChange(index),
                                        expandedIndex,
                                      )}
                                  </AccordionPanel>
                                </Td>
                              </Tr>
                            )}
                          </>
                        )
                      }}
                    </Formik>
                  )
                }}
              </AccordionItem>
            )
          })}
        </Table>
      </Accordion>
      {pagination && setPagination && (
        <TablePagination
          pagination={pagination}
          setPagination={setPagination}
          totalPages={totalPages}
          totalRecords={totalRecords}
        />
      )}
    </TableContainer>
  )
}
