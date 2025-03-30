import { CsvExport } from 'components/shared/CsvExport'
import { exportCustomers } from 'utils/requests'

export const AdminCustomers = () => {
  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h1 className='text-white font-title text-26 lg:text-subtitle text-center lg:text-left mb-16'>
          Zákazníci
        </h1>
        <CsvExport mutationFn={exportCustomers} csvFileName={'customers.csv'} />
      </div>
    </div>
  )
}
