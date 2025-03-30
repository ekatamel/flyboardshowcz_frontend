import { Spinner } from '@chakra-ui/react'
import clsx from 'clsx'

interface LoadingSpinnerProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const LoadingSpinner = ({
  className,
  size = 'xl',
}: LoadingSpinnerProps) => {
  return (
    <div
      className={clsx(
        'w-full flex justify-center items-center grow xl:h-[50vh]',
        className,
      )}
    >
      <Spinner
        thickness='3px'
        speed='0.65s'
        emptyColor='gray.600'
        color='#ffea00'
        size={size}
      />
    </div>
  )
}
