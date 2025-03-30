import { Check } from 'assets/images/Check'
import cross from 'assets/images/cross.svg'
import { Warning } from 'assets/images/Warning'
import clsx from 'clsx'

interface ToastProps {
  status: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  onClose?: () => void
}

export const Toast = ({ status, title, description, onClose }: ToastProps) => {
  const Icon = () => {
    if (status === 'success') return <Check />
    return <Warning color={status === 'error' ? '#A92525' : '#C4951B'} />
  }

  return (
    <div
      className={clsx(
        'px-24 py-16 w-400 relative',
        status === 'success' && 'bg-lightGreen',
        status === 'warning' && 'bg-lightYellow',
        status === 'error' && 'bg-lightRed',
      )}
    >
      <div className='flex items-center'>
        <Icon />
        <p className='font-title text-20 px-16'>{title}</p>
        <img
          src={cross}
          alt='Close'
          className='block ml-auto absolute top-24 right-24 cursor-pointer'
          onClick={onClose}
        />
      </div>

      <p className='text-gray text-16 pl-40 mt-8'>{description}</p>
    </div>
  )
}
