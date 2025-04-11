import { Td, Tr } from '@chakra-ui/react'
import cross from 'assets/images/cross.svg'

interface BasketTableRowProps {
  padding?: string
  onDelete?: () => void
  className?: string
  data: (string | number | JSX.Element)[]
}
export const TableRow = ({
  padding = '16px 24px',
  onDelete,
  className,
  data,
}: BasketTableRowProps) => {
  return (
    <Tr className={`relative font-title ${className}`}>
      {data.map((cell, index) => {
        return (
          <Td
            key={index}
            border={'none'}
            padding={{
              base: '10px 12px 10px 0px',
              lg: padding,
            }}
          >
            {/* Indentation for extras and merch starting with + */}
            {typeof cell === 'string' && /^\+(?!420)/.test(cell) && (
              <span className='pl-20'></span>
            )}
            {cell}
          </Td>
        )
      })}
      {onDelete && (
        <Td border={'none'} padding={'0 10px'}>
          <img
            src={cross}
            alt='Cross icon'
            className='cursor-pointer'
            onClick={onDelete}
          />
        </Td>
      )}
    </Tr>
  )
}
