import { Warning } from 'assets/images/Warning'
import clsx from 'clsx'

export const ErrorTile = () => {
  return (
    <div className='relative'>
      <div
        className={clsx(
          'lg:w-168 lg:h-140 lg:text-16 text-12 w-114 h-100 rounded font-title text-center flex flex-col gap-8 justify-between items-center lg:p-20 p-10  border border-red text-white',
        )}
      >
        <Warning color='#A92525' />
        Položku nelze aplikovat
      </div>
    </div>
  )
}
