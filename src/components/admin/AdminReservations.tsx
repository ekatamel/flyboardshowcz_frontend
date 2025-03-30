import { SmallAddIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import { AdminTable } from 'components/shared/AdminTable'
import { TabList } from 'components/shared/TabList'
import { compareAsc, format, parseISO } from 'date-fns'
import { cs } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useQuery } from 'react-query'
import 'styles/admin-day-picker.css'
import styles from 'styles/day-picker.module.css'
import {
  Branch,
  Reservation,
  ReservationData,
  ReservationDaysByBranch,
} from 'types/types'
import {
  createAdminOrder,
  fetchBranches,
  fetchReservationDays,
  fetchReservations,
} from 'utils/requests'
import { getReservationsTableColumns } from 'utils/table-config'
import { orderValidationSchema } from 'utils/validation-schemas'

import { CreateOrderModal } from './CreateOrderModal'
import { ExpandableReservationRow } from './ExpandableReservationRow'
import { ReservationDashboard } from './ReservationDashboard'

export const AdminReservations = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: reservations } = useQuery<ReservationDaysByBranch[]>(
    ['reservations'],
    fetchReservationDays,
  )

  const { data: reservationsForDay } = useQuery<ReservationData>(
    ['reservationsForDay', selectedDay, selectedBranchId],
    () => fetchReservations(selectedDay, selectedBranchId),
    {
      enabled: !!selectedDay,
    },
  )

  const { data: branches } = useQuery<Branch[]>('branches', fetchBranches)

  const branchTabListItems = useMemo(
    () => branches?.map(branch => ({ id: branch.id, name: branch.name })),
    [branches],
  )

  const reservationsByBranchMap = new Map(
    reservations?.map(reservation => [
      reservation.branch_id,
      reservation.reserved_dates.map(date => new Date(date)),
    ]),
  )

  const allUniqueReservationDays = Array.from(
    new Set([...reservationsByBranchMap.values()].flat()),
  )

  const reservationDays = selectedBranchId
    ? (reservationsByBranchMap.get(selectedBranchId) ?? [])
    : allUniqueReservationDays

  const columns = getReservationsTableColumns()

  const filteredReservations = useMemo(() => {
    return reservationsForDay?.data.sort((a, b) => {
      return compareAsc(
        parseISO(`${a.reservation.date}T${a.reservation.time}`),
        parseISO(`${b.reservation.date}T${b.reservation.time}`),
      )
    })
  }, [reservationsForDay])

  useEffect(() => {
    if (!reservationsForDay || reservationsForDay.data.length === 0) return
    setSelectedBranchId(reservationsForDay.data[0].reservation.branch_id)
  }, [reservationsForDay])

  const currentDateTime = format(new Date(), "yyyy-MM-dd'T'HH:mm")

  const initialValues = {
    purchaseType: {
      lekce: true,
      video: false,
      merch: false,
    },
    payment: {
      payment_type: 'cash',
    },
    lesson: {
      datetime: currentDateTime,
      branch_id: selectedBranchId,
    },
  }

  return (
    <div className='w-full'>
      <div className='mb-20 flex justify-between lg:mb-0'>
        <h1 className='font-title text-26 text-white lg:text-subtitle'>
          Rezervace
        </h1>
        <div className='flex gap-20'>
          <ReservationDashboard metrics={reservationsForDay?.metrics} />
          <button
            className='flex h-40 items-center gap-10 border border-yellow px-6 font-title text-12 text-yellow lg:w-200 lg:px-16 lg:py-8 lg:text-14'
            onClick={onOpen}
          >
            <SmallAddIcon
              boxSize={{
                base: 4,
                lg: 6,
              }}
            />
            Vytvořit objednávku
          </button>
        </div>
      </div>
      <CreateOrderModal
        isOpen={isOpen}
        onClose={onClose}
        formTitle='Nová objednávka'
        validationSchema={orderValidationSchema}
        initialValues={initialValues}
        mutatitonFn={createAdminOrder}
      />

      {branchTabListItems && branchTabListItems.length > 0 && (
        <TabList
          items={branchTabListItems}
          selectedTabId={selectedBranchId}
          setSelectedId={setSelectedBranchId}
          className={'justify-center'}
          selectedDay={selectedDay}
        />
      )}
      <DayPicker
        mode='single'
        className={'mt-20 text-white mx-auto'}
        selected={selectedDay}
        locale={cs}
        modifiers={{
          available: reservationDays,
        }}
        modifiersClassNames={{
          available: styles.available,
          disabled: styles.disabled,
          selected: styles.selected,
        }}
        onSelect={date => setSelectedDay(date)}
      />

      {filteredReservations && (
        <AdminTable
          data={filteredReservations}
          columns={columns}
          isFilterable={true}
          isExpandable={true}
          expandedRowRender={(
            reservation: Reservation,
            toggleExpanded: () => void,
            expandedIndex: number,
          ) => (
            <ExpandableReservationRow
              key={`${reservation.id}-${reservation.code}-${expandedIndex}`}
              reservation={reservation}
              toggleExpanded={toggleExpanded}
              expandedIndex={expandedIndex}
            />
          )}
        />
      )}
    </div>
  )
}
