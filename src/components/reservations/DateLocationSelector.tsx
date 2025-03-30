import { useMediaQuery } from '@chakra-ui/react'
import { Layout } from 'components/shared/Layout'
import { cs } from 'date-fns/locale'
import { useFormikContext } from 'formik'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useQuery } from 'react-query'
import 'styles/day-picker.css'
import styles from 'styles/day-picker.module.css'
import { Branch, Timeslot, Vouchers } from 'types/types'
import { fetchBranches } from 'utils/requests'
import {
  formatDateToString,
  getAvailableBranches,
  getAvailableDaysForBranch,
  getDates,
  getDayPickerVariants,
  getFirstAvailableMonth,
  getSelectedDayTimeslots,
  getTimePickerVariants,
  getTimeslots,
  isDisabledDate,
} from 'utils/utils'

import { BranchSelector } from './BranchSelector'
import { DateTimeInfo } from './DateTimeInfo'
import { TimeSelector } from './TimeSelector'

export const DateLocationSelector = () => {
  const { values, setFieldValue } = useFormikContext<Vouchers>()

  const [isXlBreakpoint] = useMediaQuery('(min-width: 1280px)')

  const [timeslots, setTimeslots] = useState<Timeslot[] | null>(null)

  const selectedDate = useMemo(() => {
    return values.date ? new Date(values.date) : undefined
  }, [values.date])

  const { data: branches, isLoading } = useQuery<Branch[]>(
    'branches',
    fetchBranches,
  )

  const avaiableBranches = useMemo(() => {
    return getAvailableBranches(timeslots, branches, selectedDate)
  }, [timeslots, branches, selectedDate])

  const availableBranchTimeslots = useMemo(
    () => getAvailableDaysForBranch(timeslots, values.branch_id),
    [timeslots, values.branch_id],
  )

  const availableBranchDates = getDates(availableBranchTimeslots)

  const selectedDayTimeslots = useMemo(() => {
    if (!selectedDate) return
    return getSelectedDayTimeslots(availableBranchTimeslots, selectedDate)
  }, [availableBranchTimeslots, selectedDate])

  const showTimeSelector =
    !!selectedDayTimeslots && selectedDayTimeslots.length && values.branch_id

  const isNextStepEnabled = values.date && values.branch_id && values.time

  useEffect(() => {
    getTimeslots(values.vouchers, setTimeslots, setFieldValue)
  }, [values.vouchers, setFieldValue])

  useEffect(() => {
    if (!selectedDate || !avaiableBranches || avaiableBranches?.length > 1)
      return

    setFieldValue('branch_id', avaiableBranches[0].id)
    setFieldValue('branch_name', avaiableBranches[0].name)
  }, [selectedDate, avaiableBranches, setFieldValue])

  return (
    <Layout
      stepName='Termín'
      title='ZAREZERVUJ SI SVŮJ TERMÍN'
      middleComponent={<DateTimeInfo />}
      isNextDisabled={!isNextStepEnabled}
    >
      <p className='mt-20 flex flex-col px-20 text-center text-14 text-white sm:px-44 md:px-80 lg:mt-38 lg:px-100 lg:text-16 xl:mt-10 xl:px-0'>
        Vyberte LOKALITU, DATUM I ČAS. Kliknutím zažluťte všechna pole.
        <div className='mt-4'>
          <span className='bg-white p-2 text-black'>Bílá pole</span> = volné
          termíny / neoznačené lokality.{' '}
          <span className='bg-yellow p-2 text-black'>Žlutá pole</span> = zvolené
          termíny. <span className='border border-white p-2'>Černá pole</span> =
          nelétáme / je již plno.
        </div>
      </p>

      <h2 className='mt-20 text-center font-title text-20 text-white'>
        Dostupné lokality
      </h2>
      <div className='relative px-60'>
        <BranchSelector
          isLoading={isLoading}
          avaiableBranches={avaiableBranches}
        />
      </div>

      <div className='mb-20 flex flex-col justify-center sm:flex-row sm:px-20 md:px-60 lg:gap-40 lg:px-70 xl:px-0'>
        <motion.div
          variants={getDayPickerVariants(isXlBreakpoint)}
          initial='hidden'
          animate={showTimeSelector ? 'visible' : 'hidden'}
          className='w-full lg:w-1/2'
        >
          {availableBranchDates.length > 0 && (
            <DayPicker
              mode='single'
              className={'mt-20 text-white'}
              selected={selectedDate}
              defaultMonth={getFirstAvailableMonth(availableBranchDates)}
              onSelect={date => {
                setFieldValue('date', date && formatDateToString(date))
                setFieldValue('time', null)
                setFieldValue('timeslot_id', null)
              }}
              modifiers={{
                available: availableBranchDates,
                disabled: date => isDisabledDate(availableBranchDates, date),
              }}
              modifiersClassNames={{
                available: styles.available,
                disabled: styles.disabled,
                selected: styles.selected,
              }}
              locale={cs}
            />
          )}
          {availableBranchDates.length === 0 && (
            <DayPicker
              mode='single'
              className={'mt-20 text-white'}
              defaultMonth={new Date()}
              locale={cs}
              disabled={true}
            />
          )}
        </motion.div>
        {showTimeSelector && (
          <motion.div
            variants={getTimePickerVariants(isXlBreakpoint)}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.2 }}
            className='w-full lg:w-1/2'
          >
            <TimeSelector timeslots={selectedDayTimeslots} />
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
