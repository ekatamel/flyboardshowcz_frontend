import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import clsx from 'clsx'
import { Formik } from 'formik'
import { useLayoutEffect, useRef, useState } from 'react'
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
  const [isMobile] = useMediaQuery('(max-width: 480px)')
  const headerRefs = useRef<HTMLElement[]>([])
  const bodyRowRefs = useRef<HTMLElement[][]>([])
  const [columnWidths, setColumnWidths] = useState<string[]>([])

  const handleChange = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index)
  }

  const table = useReactTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  useLayoutEffect(() => {
    if (isMobile) {
      const newColumnWidths: string[] = []
      headerRefs.current.forEach((headerCell, columnIndex) => {
        let maxWidth = headerCell?.offsetWidth || 0
        bodyRowRefs.current.forEach(row => {
          const bodyCell = row[columnIndex]
          maxWidth = Math.max(maxWidth, bodyCell?.offsetWidth || 0)
        })
        newColumnWidths[columnIndex] = `${maxWidth}px`
      })
      setColumnWidths(newColumnWidths)
    } else {
      setColumnWidths([]) // Reset widths for larger screens
    }
  }, [
    isMobile,
    data,
    table.getHeaderGroups().length,
    table.getRowModel().rows.length,
  ])

  return (
    <Box className='mt-30' overflowX='auto' width={isMobile ? 'auto' : '100%'}>
      <Accordion
        allowToggle
        index={expandedIndex}
        onChange={handleChange}
        overflowX='auto'
        width={isMobile ? 'auto' : '100%'}
      >
        {/* Table Header */}
        <Flex
          as='div'
          bg='black'
          borderBottom='1px solid #ffea00'
          color='#ffea00'
          fontFamily='Bebas Neue'
          fontSize={{ base: '16px', lg: '18px' }}
          fontWeight='normal'
          width='100%'
          flexWrap='nowrap'
        >
          {table.getHeaderGroups().map(headerGroup => (
            <Flex key={headerGroup.id} as='div' display='flex' width='100%'>
              {headerGroup.headers.map((header, index) => (
                <Box
                  key={header.id}
                  ref={el => (headerRefs.current[index] = el as HTMLElement)}
                  padding={{ base: '8px', lg: '12px' }}
                  width={isMobile ? columnWidths[index] : '0'}
                  flexGrow={isMobile ? 0 : 1}
                  flexShrink={isMobile ? 0 : 1}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Box>
              ))}
              {/* Placeholder for expandable row icon */}
              {isExpandable && <Box width={'40px'}></Box>}
            </Flex>
          ))}
        </Flex>

        {/* Table Body */}
        {table.getRowModel().rows.map((row, index) => (
          <AccordionItem
            className='text-white font-title text-18 border-none'
            key={row.id}
            borderBottom='1px solid #2D3748'
          >
            {({ isExpanded }) => {
              const initialValues: any = getInitialData
                ? getInitialData(row.original)
                : {}
              const rowColor = getRowColor(row.original)
              bodyRowRefs.current[index] = [] // Initialize ref array for the row

              return (
                <Formik
                  initialValues={initialValues}
                  onSubmit={values =>
                    updateFunction ? updateFunction(values as T) : undefined
                  }
                >
                  {({ values }) => (
                    <>
                      {/* Table Row */}
                      <Flex
                        as='div'
                        display='flex'
                        width='100%'
                        style={{ backgroundColor: rowColor }}
                        className={clsx(rowColor, 'cursor-pointer')}
                        onClick={() => handleChange(index)}
                        flexWrap='nowrap'
                      >
                        {row.getVisibleCells().map((cell, cellIndex) => (
                          <Box
                            key={cell.id}
                            ref={el =>
                              (bodyRowRefs.current[index][cellIndex] =
                                el as HTMLElement)
                            }
                            width={isMobile ? columnWidths[cellIndex] : '0'}
                            flexGrow={isMobile ? 0 : 1}
                            flexShrink={isMobile ? 0 : 1}
                            padding={{ base: '2px 8px', lg: '8px 12px' }}
                            fontSize={{ base: '16px', lg: '18px' }}
                            borderColor='#ffea00'
                            borderBottom={
                              isExpanded ? 'none' : '1px solid #ffea00'
                            }
                            className={clsx(
                              initialValues[cell.column.id] !==
                                values[cell.column.id] && 'bg-gray',
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Box>
                        ))}
                        {isExpandable && (
                          <Box
                            width={'40px'}
                            borderBottom={
                              isExpanded ? 'none' : '1px solid #ffea00'
                            }
                          >
                            <AccordionButton justifyContent={'end'}>
                              <AccordionIcon />
                            </AccordionButton>
                          </Box>
                        )}
                      </Flex>

                      {/* Expanded Row */}
                      {isExpandable && index === expandedIndex && (
                        <Box as='div' width='100%'>
                          <Box
                            width='100%'
                            padding={0}
                            borderBottom='1px solid #ffea00'
                          >
                            <AccordionPanel
                              className='bg-darkGray border-b border-yellow'
                              key={`item-${row.id}`}
                              style={{
                                minWidth: isMobile
                                  ? columnWidths.reduce(
                                      (sum, width) => sum + parseInt(width, 10),
                                      0,
                                    ) + 'px'
                                  : '100%',
                              }}
                            >
                              {expandedRowRender &&
                                expandedRowRender(
                                  row.original,
                                  () => handleChange(index),
                                  expandedIndex,
                                )}
                            </AccordionPanel>
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Formik>
              )
            }}
          </AccordionItem>
        ))}
      </Accordion>
      {pagination && setPagination && (
        <TablePagination
          pagination={pagination}
          setPagination={setPagination}
          totalPages={totalPages}
          totalRecords={totalRecords}
        />
      )}
    </Box>
  )
}
