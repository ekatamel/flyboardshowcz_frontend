import { AdminTable } from 'components/shared/AdminTable'
import { isSameDay } from 'date-fns'
import { Lecturer, TimeInfo, TimeslotsByDay } from 'types/types'
import { getAvailabilityTableColumns } from 'utils/table-config'

import { ExpandedAvailabilityRow } from './ExpandedAvailabilityRow'
// TODO = pagination ???
interface AvailabilityByBranchProps {
  branchAvailability:
    | {
        [date: string]: {
          branch_id: number
          scooters: number
          lecturers: Lecturer[]
          timeslots: TimeInfo[]
        }
      }
    | undefined
  selectedDay: Date | undefined
}

export const AvailabilityByBranch = ({
  branchAvailability,
  selectedDay,
}: AvailabilityByBranchProps) => {
  if (!branchAvailability) return null

  const tableData = Object.keys(branchAvailability).map(date => {
    return {
      date,
      ...branchAvailability[date],
    }
  })

  const filteredTableData = selectedDay
    ? tableData.filter(tableRow =>
        isSameDay(new Date(tableRow.date), selectedDay),
      )
    : tableData

  const columns = getAvailabilityTableColumns()

  return (
    <AdminTable
      data={filteredTableData}
      columns={columns}
      isFilterable={false}
      isExpandable={true}
      expandedRowRender={(
        timeslot: TimeslotsByDay,
        toggleExpanded: () => void,
      ) => (
        <ExpandedAvailabilityRow
          key={`${timeslot.branch_id}-${timeslot.date}`}
          timeslot={timeslot}
          toggleExpanded={toggleExpanded}
        />
      )}
    />
  )
}
