import { Th, Thead, Tr } from '@chakra-ui/react'

interface TableHeadRowProps {
  data: (string | JSX.Element)[]
  noBorder?: boolean
  padding?: string
  className?: string
}

export const TableHead = ({
  noBorder = false,
  data,
  padding = '16px 24px',
  className,
}: TableHeadRowProps) => {
  return (
    <Thead>
      <Tr className={className}>
        {data.map((item, index) => (
          <Th
            key={`${item}-${index}`}
            padding={{
              base: '10px 12px 10px 0px',
              lg: padding,
            }}
            borderBottom={{
              base: 'none',
              lg: `${noBorder ? 'none' : '1px solid rgba(255, 234, 0, 1)'}`,
            }}
            borderTop={{
              base: `${noBorder ? 'none' : '1px solid rgba(255, 234, 0, 1)'}`,
              lg: 'none',
            }}
            fontSize={{
              base: '14px',
              lg: '16px',
            }}
            color={'rgba(255, 255, 255, 0.7)'}
            fontFamily={'Bebas Neue'}
            fontWeight={'normal'}
            className='grow'
          >
            {item}
          </Th>
        ))}
      </Tr>
    </Thead>
  )
}
