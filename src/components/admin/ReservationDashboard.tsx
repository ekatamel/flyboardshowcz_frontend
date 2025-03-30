import { ViewIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import {
  BadgeDollarSign,
  Clock,
  CreditCard,
  HandCoins,
  Package,
  QrCode,
  Ticket,
  Users,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { ReservationMetrics } from 'types/types'

interface ReservationDashboardProps {
  metrics: ReservationMetrics | undefined
}

export const ReservationDashboard = ({
  metrics,
}: ReservationDashboardProps) => {
  const [activeTab, setActiveTab] = useState('revenue')
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!metrics) return null

  return (
    <>
      <button
        className='flex h-40 items-center gap-10 border border-yellow px-6 font-title text-12 text-yellow lg:w-200 lg:px-16 lg:py-8 lg:text-14'
        onClick={onOpen}
      >
        <ViewIcon
          boxSize={{
            base: 4,
            lg: 6,
          }}
        />
        Zobrazit metriky
      </button>
      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
        <ModalContent
          color={'white'}
          border={'1px solid white'}
          borderRadius={0}
        >
          <ModalCloseButton color={'white'} />
          <ModalHeader
            className='font-title text-36 text-center'
            fontWeight={'normal'}
          >
            Dashboard
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className='flex w-full flex-col bg-gray-100'>
              <div className='flex flex-col'>
                <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
                  <div className='space-y-4'>
                    <div className='flex space-x-1 rounded-md bg-gray-200 p-1 font-title mb-20'>
                      <button
                        onClick={() => setActiveTab('revenue')}
                        className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium ${
                          activeTab === 'revenue'
                            ? 'bg-yellow shadow text-black'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Tržby
                      </button>
                      <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium ${
                          activeTab === 'products'
                            ? 'bg-yellow shadow text-black'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Extras
                      </button>
                      <button
                        onClick={() => setActiveTab('customers')}
                        className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium ${
                          activeTab === 'customers'
                            ? 'bg-yellow shadow text-black'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Zákazníci
                      </button>
                    </div>
                    {activeTab === 'revenue' && (
                      <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              Kartou
                            </p>
                            <CreditCard className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='text-2xl font-bold'>
                            {metrics.money.card.toFixed(2)} CZK
                          </div>
                        </div>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold mb-10 text-yellow'>
                              Hotovost
                            </p>
                            <BadgeDollarSign className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='text-2xl font-bold '>
                            {metrics.money.cash.toFixed(2)} CZK
                          </div>
                        </div>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              QR
                            </p>
                            <QrCode className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='text-2xl font-bold'>
                            {metrics.money.qr.toFixed(2)} CZK
                          </div>
                        </div>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              Celkem dnes
                            </p>
                            <HandCoins className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='text-2xl font-bold'>
                            {metrics.money.total.toFixed(2)} CZK
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'products' && (
                      <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              Video
                            </p>
                            <Video className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
                            <div className='flex flex-col'>
                              <span>Přikoupeno</span>
                              <span className='text-lg font-bold'>
                                {metrics.videos.videos_bought_today}
                              </span>
                            </div>
                            <div className='flex flex-col'>
                              <span>Celkem</span>
                              <span className='text-lg font-bold'>
                                {metrics.videos.total_videos}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              Minuty
                            </p>
                            <Clock className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
                            <div className='flex flex-col'>
                              <span>Přikoupeno</span>
                              <span className='text-lg font-bold'>
                                {metrics.minutes.extra_minutes_today}
                              </span>
                            </div>
                            <div className='flex flex-col'>
                              <span>Celkem</span>
                              <span className='text-lg font-bold'>
                                {metrics.minutes.total_minutes}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              Merch
                            </p>
                            <Package className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
                            <div className='flex flex-col'>
                              <span>Přikoupeno</span>
                              <span className='text-lg font-bold'>
                                {metrics.merch.merch_bought_today}
                              </span>
                            </div>
                            <div className='flex flex-col'>
                              <span>Celkem</span>
                              <span className='text-lg font-bold'>
                                {metrics.merch.total_merch}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'customers' && (
                      <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              Walk-inů
                            </p>
                            <Users className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='text-2xl font-bold'>
                            {metrics.vouchers.walkins}
                          </div>
                        </div>
                        <div className='rounded-lg border p-10 shadow-sm bg-black border-white'>
                          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <p className='text-sm font-bold text-yellow mb-10'>
                              Celkem voucherů
                            </p>
                            <Ticket className='h-20 w-20 text-yellow' />
                          </div>
                          <div className='text-2xl font-bold'>
                            {metrics.vouchers.total_vouchers}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </main>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
