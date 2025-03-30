import { SmallAddIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import { AdminTab } from 'components/shared/AdminTab'
import { useState } from 'react'
import { TabId } from 'types/types'

import { AdminAvailability } from './AdminAvailability'
import { AdminDiscounts } from './AdminDiscounts'
import { AdminLocations } from './AdminLocations'
import { CreateDiscountModal } from './CreateDiscountModal'
import { CreateLocationModal } from './CreateLocationModal'
import { CreateTimeslotModal } from './CreateTimeslotModal'

export const AdminSettings = () => {
  const [selectedTabId, setSelectedTabId] = useState<TabId>(TabId.Discounts)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const tabListItems = [
    { id: 1, name: 'Slevové kódy', element: <AdminDiscounts /> },
    { id: 2, name: 'Lokace', element: <AdminLocations /> },
    { id: 3, name: 'Dostupnost', element: <AdminAvailability /> },
  ]

  const addButtonConfig = {
    1: {
      text: 'Přidat slevový kód',
      modal: <CreateDiscountModal isOpen={isOpen} onClose={onClose} />,
    },
    2: {
      text: 'Přidat lokaci',
      modal: <CreateLocationModal isOpen={isOpen} onClose={onClose} />,
    },
    3: {
      text: 'Přidat termíny',
      modal: <CreateTimeslotModal isOpen={isOpen} onClose={onClose} />,
    },
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between mb-20 lg:mb-0'>
        <h1 className='text-white font-title text-26 lg:text-subtitle'>
          Nastavení
        </h1>
        <button
          className='h-40 font-title text-yellow border border-yellow text-12 lg:text-14 lg:py-8 px-6 lg:px-16 flex gap-10 items-center lg:w-200'
          onClick={onOpen}
        >
          <SmallAddIcon
            boxSize={{
              base: 4,
              lg: 6,
            }}
          />
          {addButtonConfig[selectedTabId].text}
        </button>
      </div>

      {addButtonConfig[selectedTabId].modal}

      <div className='flex justify-center gap-10'>
        {tabListItems.map(item => {
          return (
            <AdminTab
              key={item.id}
              item={item}
              selectedTabId={selectedTabId}
              setSelectedId={setSelectedTabId}
            />
          )
        })}
      </div>

      <div>{tabListItems.find(item => item.id === selectedTabId)?.element}</div>
    </div>
  )
}
