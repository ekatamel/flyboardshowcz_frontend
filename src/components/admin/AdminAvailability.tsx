import { TabList } from 'components/shared/TabList'
import { cs } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useQuery } from 'react-query'
import 'styles/admin-day-picker.css'
import styles from 'styles/day-picker.module.css'
import { Branch, Timeslot, TimeslotsByDayAndTime } from 'types/types'
import { fetchBranches, fetchTimeslots } from 'utils/requests'

import { AvailabilityByBranch } from './AvailabilityByBranch'

export const AdminAvailability = () => {
  const { data: timeslots } = useQuery<Timeslot[]>('timeslots', fetchTimeslots)
  const { data: branches } = useQuery<Branch[]>('branches', fetchBranches)

  const branchTabListItems = useMemo(
    () => branches?.map(branch => ({ id: branch.id, name: branch.name })),
    [branches],
  )

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>()

  const timeslotsReducedByBranchAndDay = timeslots?.reduce(
    (acc: TimeslotsByDayAndTime, timeslot) => {
      const {
        branch_id,
        date,
        time,
        total_time_slots,
        lecturers,
        available_time_slots,
        is_active,
        id,
      } = timeslot
      if (!acc[branch_id]) acc[branch_id] = {}

      const timeInfo = {
        timeslotId: id,
        time,
        isActive: is_active,
        isReserved: available_time_slots !== total_time_slots,
        lecturers,
      }

      if (!acc[branch_id][date]) {
        acc[branch_id][date] = {
          branch_id,
          scooters: total_time_slots / 12,
          lecturers,
          timeslots: [timeInfo],
        }
      } else {
        acc[branch_id][date].timeslots.push(timeInfo)
      }

      return acc
    },
    {},
  )

  useEffect(() => {
    if (branchTabListItems && branchTabListItems.length > 0)
      setSelectedBranchId(branchTabListItems[0].id)
  }, [branchTabListItems])

  return (
    <div>
      {branchTabListItems && branchTabListItems.length > 0 && (
        <TabList
          items={branchTabListItems}
          selectedTabId={selectedBranchId}
          setSelectedId={setSelectedBranchId}
          className={'justify-center'}
          selectedDay={selectedDay}
        />
      )}
      {timeslotsReducedByBranchAndDay && (
        <>
          <DayPicker
            mode='single'
            className={'mt-20 text-white mx-auto'}
            selected={selectedDay}
            locale={cs}
            modifiers={{
              available:
                selectedBranchId &&
                timeslotsReducedByBranchAndDay[selectedBranchId]
                  ? Object.keys(
                      timeslotsReducedByBranchAndDay[selectedBranchId],
                    ).map(date => new Date(date))
                  : [],
            }}
            modifiersClassNames={{
              available: styles.available,
              disabled: styles.disabled,
              selected: styles.selected,
            }}
            onSelect={date => setSelectedDay(date)}
          />
          <AvailabilityByBranch
            branchAvailability={
              selectedBranchId
                ? timeslotsReducedByBranchAndDay[selectedBranchId]
                : undefined
            }
            selectedDay={selectedDay}
          />
        </>
      )}
    </div>
  )
}
