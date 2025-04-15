import { Tooltip } from '@chakra-ui/react'
import { Alert } from 'assets/images/Alert'
import { clsx } from 'clsx'
import { FunctionComponent, SVGProps, useState } from 'react'

import { Badge } from './Badge'

interface TileProps {
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>
  title: string
  subtitle?: string | number
  isSelected?: boolean
  onClick: () => void
  overlay?: JSX.Element | null
  tooltip?: string
  badgeText?: string
  selector?: JSX.Element | null
}

export const Tile = ({
  title,
  subtitle,
  isSelected = false,
  icon: Icon,
  onClick,
  overlay,
  tooltip,
  badgeText,
  selector,
}: TileProps) => {
  const [isHovered, setIsHovered] = useState(false)

  if (overlay) return overlay

  const tileClasses = clsx(
    baseTileClasses,
    !selector && 'transition hover:scale-105',
    isSelected ? selectedTileClasses : notSelectedTileClasses,
    overlay && overlayClasses,
  )

  const isHighlighted = isHovered || isSelected

  return (
    <div className='relative'>
      {selector}
      <div
        className={tileClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {badgeText && <Badge text={badgeText} isHighlighted={isHighlighted} />}
        {title}
        {Icon && (
          <Icon
            data-testid='tile-icon'
            fill={clsx(isHighlighted ? 'black' : 'rgba(255, 234, 0, 1)')}
          />
        )}
        <span className={clsx(isHighlighted ? 'text-black' : 'text-white')}>
          {subtitle}
        </span>
        {tooltip && (
          <Tooltip
            display={{ base: 'none', lg: 'block' }}
            label={<p>{tooltip}</p>}
          >
            <span className='absolute top-5 right-8'>
              <Alert
                className='w-20'
                fill={isHighlighted ? '#000000' : '#FFEA00'}
              />
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

const baseTileClasses =
  'lg:w-168 lg:h-140 lg:text-16 text-12 w-114 h-100 rounded font-title cursor-pointer text-center flex flex-col gap-8 justify-between items-center lg:p-20 p-10 relative overflow-hidden'
const selectedTileClasses =
  'bg-yellow text-black transition hover:shadow-custom-yellow'
const notSelectedTileClasses =
  'bg-black text-yellow border border-yellow hover:bg-yellow hover:text-black'
const overlayClasses = 'border border-yellow'
