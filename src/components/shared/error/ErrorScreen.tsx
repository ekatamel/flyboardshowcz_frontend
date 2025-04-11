import { useNavigate } from 'react-router-dom'

import { Button } from '../Button'
import { ErrorMessage } from './ErrorMessage'

export const ErrorScreen = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 w-full'>
      <ErrorMessage theme='light' />

      <Button
        title='Zpět na výběr'
        variant='primary'
        className='mt-20'
        onClick={() => navigate('/')}
      />
    </div>
  )
}
