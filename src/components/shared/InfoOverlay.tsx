import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import { Alert } from 'assets/images/Alert'
import { isMobile } from 'react-device-detect'

interface InfoOverlayProps {
  label: string | JSX.Element | null
  fill?: string
  children?: JSX.Element
}

export const InfoOverlay = ({ label, fill, children }: InfoOverlayProps) => {
  if (!label) return <>{children}</>
  return (
    <Popover trigger={isMobile ? 'click' : 'hover'}>
      <PopoverTrigger>
        <span>
          {children || (
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
