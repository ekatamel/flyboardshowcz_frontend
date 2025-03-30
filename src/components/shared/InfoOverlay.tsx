import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import { Alert } from 'assets/images/Alert'
import { isMobile } from 'react-device-detect'

interface InfoOverlayProps {
  label: string | JSX.Element
  content?: JSX.Element
  fill?: string
  showLabel?: boolean
}

export const InfoOverlay = ({
  label,
  content,
  fill,
  showLabel = true,
}: InfoOverlayProps) => {
  if (showLabel === false) return <>{content}</>
  return (
    <Popover trigger={isMobile ? 'click' : 'hover'}>
      <PopoverTrigger>
        <span>
          {content || (
            <Alert
              className='w-16 lg:w-20 cursor-pointer'
              fill={fill ?? '#FFEA00'}
            />
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>{label}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
