import { Td, Tr } from '@chakra-ui/react'
import cross from 'assets/images/cross.svg'
import { useState } from 'react'

interface BasketTableRowProps {
  padding?: string
  isHover?: boolean
  onDelete?: () => void
  className?: string
  data: (string | number | JSX.Element)[]
}
export const TableRow = ({
  padding = '16px 24px',
  isHover = true,
  onDelete,
  className,
  data,
}: BasketTableRowProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Tr
      onMouseEnter={() => isHover && setIsHovered(true)}
      onMouseLeave={() => isHover && setIsHovered(false)}
      className={`relative font-title ${className}`}
    >
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
      {onDelete && isHovered && (
        <img
          src={cross}
          alt='Cross icon'
          className='absolute right-6 top-14 cursor-pointer'
          onClick={onDelete}
        />
      )}
    </Tr>
  )
}
