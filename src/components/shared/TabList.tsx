import clsx from 'clsx'
import { useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Virtual } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { AdminTab } from './AdminTab'

interface TabListProps {
  items: { id: number; name: string; element?: JSX.Element }[]
  className?: string
  selectedTabId: number | null
  setSelectedId: (id: number | null) => void
  selectedDay: Date | undefined
}

export const TabList = ({
  items,
  selectedTabId,
  className,
  setSelectedId,
  selectedDay,
}: TabListProps) => {
  const [swiper, setSwiper] = useState<any>(null)

  useEffect(() => {
    if (!swiper || !selectedDay) return
    const selectedIndex = items.findIndex(item => item.id === selectedTabId)
    if (selectedIndex !== -1) {
      swiper.slideTo(selectedIndex)
    }
  }, [selectedDay, items, swiper, selectedTabId])

  return (
    <div className='relative'>
      <Swiper
        modules={[Virtual, Navigation, Pagination]}
        navigation={true}
        onSwiper={setSwiper}
        centeredSlides={items.length > 6 ? false : true}
        direction={'horizontal'}
        centerInsufficientSlides={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
        }}
        className={clsx('admin-branch-swiper', className)}
      >
        {items.map((item, index) => {
          return (
            <SwiperSlide
              key={item.id}
              virtualIndex={index}
              onClick={() => swiper.slideTo(index)}
            >
              <AdminTab
                item={item}
                selectedTabId={selectedTabId}
                setSelectedId={() =>
                  setSelectedId(selectedTabId === item.id ? null : item.id)
                }
              />
            </SwiperSlide>
          )
        })}
      </Swiper>

      <div>{items.find(item => item.id === selectedTabId)?.element}</div>
    </div>
  )
}
