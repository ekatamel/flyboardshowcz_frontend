import clsx from 'clsx'
import { Pill } from 'components/shared/Pill'
import { TimeInfo } from 'types/types'

interface AvailabilityTimeslotsProps {
  timeslots: TimeInfo[]
  changedTimeslots: Record<number, boolean> | null
  setChangedTimeslots: React.Dispatch<
    React.SetStateAction<Record<number, boolean> | null>
  >
}

export const AvailabilityTimeslots: React.FC<AvailabilityTimeslotsProps> = ({
  timeslots,
  changedTimeslots,
  setChangedTimeslots,
}) => {
  return (
    <div className='w-full flex gap-20'>
      {timeslots.map(timeslot => {
        const { isActive, isReserved, time, timeslotId } = timeslot
        const isChanged = changedTimeslots?.[timeslotId] !== undefined
        const currentActiveState = isChanged
          ? changedTimeslots?.[timeslotId]
          : isActive

        const getPillColor = () => {
          if (isReserved) {
            return currentActiveState ? 'bg-orange' : 'bg-purple-600'
          } else {
            return currentActiveState ? 'bg-yellow' : 'bg-pillGray'
          }
        }

        return (
          <Pill
            key={timeslotId}
            text={time}
            className={clsx('font-normal h-30', getPillColor())}
            onClick={() =>
              setChangedTimeslots(prevChangedTimeslots => ({
                ...prevChangedTimeslots,
                [timeslotId]: !currentActiveState,
              }))
            }
          />
        )
      })}
    </div>
  )
}
