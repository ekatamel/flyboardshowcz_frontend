import { Warning } from 'assets/images/Warning'
import clsx from 'clsx'

interface ErrorMessageProps {
  theme: 'dark' | 'light'
}

export const ErrorMessage = ({ theme }: ErrorMessageProps) => {
  return (
    <div className='flex flex-col items-center justify-center px-10 py-20 w-full'>
      <Warning color='#A92525' />
      <p
        className={clsx(
          'font-title text-20 px-16 mt-10',
          theme === 'dark' ? 'text-errorRed' : 'text-darkGray',
        )}
      >
        Něco se pokazilo
      </p>
      <p
        className={clsx(
          'text-16 pl-40 mt-8',
          theme === 'dark' ? 'text-white' : 'text-gray',
        )}
      >
        Při zpracování požadavku došlo k problému.
      </p>
      <p
        className={clsx(
          'text-16 pl-40 mt-8',
          theme === 'dark' ? 'text-white' : 'text-gray',
        )}
      >
        Zkuste to prosím znovu.
      </p>
    </div>
  )
}
