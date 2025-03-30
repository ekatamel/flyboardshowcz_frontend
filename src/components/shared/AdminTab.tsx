import clsx from 'clsx'

interface AdminTabProps {
  item: { id: number; name: string; element?: JSX.Element }
  selectedTabId: number | null
  setSelectedId: (id: number) => void
}

export const AdminTab = ({
  item,
  selectedTabId,
  setSelectedId,
}: AdminTabProps) => {
  return (
    <div
      className={clsx(
        'font-title text-14 h-40 w-70 text-center cursor-pointer shrink-0',
        item.id === selectedTabId
          ? 'text-black bg-yellow border-b-2 border-white'
          : 'text-yellow bg-black',
      )}
      onClick={() => setSelectedId(item.id)}
    >
      {item.name}
    </div>
  )
}
