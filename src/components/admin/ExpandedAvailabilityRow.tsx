import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { AdminButton } from 'components/shared/AdminButton'
import { useToastMessage } from 'hooks/useToastMesage'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Select from 'react-select'
import { Lector, TimeslotsByDay } from 'types/types'
import {
  deleteDayTimeslots,
  fetchLectors,
  updateTimeslots,
} from 'utils/requests'
import { isBeforeNoon, selectStyles } from 'utils/utils'

import { AvailabilityTimeslots } from './AvailabilityTimeslots'

interface ExpandedAvailabilityRowProps {
  timeslot: TimeslotsByDay
  toggleExpanded: () => void
}

export const ExpandedAvailabilityRow = ({
  timeslot,
  toggleExpanded,
}: ExpandedAvailabilityRowProps) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<any>(null)

  const { data: lectors } = useQuery<Lector[]>('lectors', fetchLectors)
  const { timeslots, date, branch_id } = timeslot

  const [changedTimeslots, setChangedTimeslots] = useState<Record<
    number,
    boolean
  > | null>(null)

  const [timeslotLectors, setTimeslotLectors] = useState<
    { value: number; label: string }[] | null
  >(null)

  const lectorsOptions = lectors?.map(
    ({ id, first_name, last_name, nickname }) => {
      return { value: id, label: `${first_name} ${last_name} (${nickname})` }
    },
  )

  const preselectedLectorsOptions = timeslots[0].lecturers
    .map(lecturer => {
      const lector = lectorsOptions?.find(
        lector => lector.value === lecturer.id,
      )

      if (!lector) return

      return {
        value: lecturer.id,
        label: lector.label,
      }
    })
    .filter(Boolean) as { value: number; label: string }[]

  const timeslotsBeforeNoon = timeslots.filter(timeslot =>
    isBeforeNoon(timeslot.time),
  )

  const timeslotsAfterNoon = timeslots.filter(
    timeslot => !isBeforeNoon(timeslot.time),
  )

  const deleteDay = async () => {
    await deleteDayTimeslots({ date, branch_id })
    await queryClient.invalidateQueries('timeslots')
    showToast({
      status: 'success',
      message: 'Timesloty pro daný den byly úspěšně smazány',
    })
  }

  const cancelChanges = () => {
    setChangedTimeslots(null)
    setTimeslotLectors(preselectedLectorsOptions)
    toggleExpanded()
  }

  const { mutate: updateTimeslot, isLoading } = useMutation(updateTimeslots, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('timeslots')
      toggleExpanded()
      showToast({ status: 'success' })
    },
    onError: (error: any) => {
      showToast({
        status: 'error',
        message: error.message,
      })
    },
  })

  const updateTimeslotInfo = async () => {
    const updatedTimeslots = timeslots.map(({ timeslotId, isActive }) => {
      return {
        timeslot_id: timeslotId,
        is_active: changedTimeslots?.[Number(timeslotId)] ?? isActive,
        lectors: timeslotLectors?.map(lector => ({ id: lector.value })) || [],
      }
    })

    const updatedDayTimeslots = {
      date,
      branch_id,
      timeslots: updatedTimeslots,
    }

    updateTimeslot(updatedDayTimeslots)
  }

  useEffect(() => {
    setChangedTimeslots(
      timeslots.reduce((acc: Record<number, boolean>, timeslot) => {
        acc[timeslot.timeslotId] = timeslot.isActive
        return acc
      }, {}),
    )
  }, [timeslots])

  useEffect(() => {
    if (lectors) setTimeslotLectors(preselectedLectorsOptions)
  }, [lectors, preselectedLectorsOptions])

  return (
    <div className='flex flex-col gap-12 lg:gap-30 lg:pt-22 lg:px-10 lg:pb-10'>
      <div className='flex'>
        <p className='font-title text-yellow text-14 w-120'>Lektoří</p>
        <Select
          options={lectorsOptions}
          isMulti
          styles={selectStyles}
          value={timeslotLectors}
          onChange={(option: any) => setTimeslotLectors(option)}
        />
      </div>
      <div className='flex'>
        <p className='font-title text-yellow text-14 w-120 shrink-0'>Ráno</p>
        <AvailabilityTimeslots
          timeslots={timeslotsBeforeNoon}
          changedTimeslots={changedTimeslots}
          setChangedTimeslots={setChangedTimeslots}
        />
      </div>
      <div className='flex'>
        <p className='font-title text-yellow text-14 w-120 shrink-0'>Večer</p>
        <AvailabilityTimeslots
          timeslots={timeslotsAfterNoon}
          changedTimeslots={changedTimeslots}
          setChangedTimeslots={setChangedTimeslots}
        />
      </div>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className='border border-white p-4'>
            <AlertDialogHeader className='text-white'>
              Mazání termínů
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody className='text-white'>
              Opravdu chcete smazat všechny termíny pro daný den?
            </AlertDialogBody>
            <AlertDialogFooter>
              <AdminButton
                title='Zrušit'
                className='bg-black border-yellow text-yellow'
                onClick={onClose}
              />
              <AdminButton
                title='Smazat'
                onClick={() => deleteDay()}
                className='bg-red border-black text-black ml-auto'
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <div className='flex gap-20 justify-end'>
        <AdminButton
          title='Zrušit'
          className='bg-black border-yellow text-yellow'
          onClick={() => cancelChanges()}
        />
        <AdminButton
          title='Uložit'
          className='bg-yellow border-yellow text-black'
          onClick={() => updateTimeslotInfo()}
          disabled={isLoading}
        />
        <AdminButton
          title='Smazat den'
          onClick={onOpen}
          className='bg-red border-black text-black ml-auto'
        />
      </div>
    </div>
  )
}
