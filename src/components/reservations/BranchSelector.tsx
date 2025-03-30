import clsx from 'clsx'
import { useFormikContext } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Virtual } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Branch, Vouchers } from 'types/types'
interface BranchSelectorProps {
  avaiableBranches?: Branch[]
  isLoading: boolean
}

export const BranchSelector = ({
  avaiableBranches,
  isLoading,
}: BranchSelectorProps) => {
  const { showToast, isActive } = useToastMessage()
  const [swiper, setSwiper] = useState<any>(null)
  const { values, setFieldValue } = useFormikContext<Vouchers>()

  if (
    !isLoading &&
    avaiableBranches &&
    avaiableBranches.length === 0 &&
    !isActive('no-timeslots')
  )
    showToast({
      id: 'no-timeslots',
      status: 'error',
      message: 'Nebyly nalezeny žádné termíny',
      description:
        'Zkuste prosím později nebo kontaktujte nás na info@flyboardshow.cz nebo na telefonním čísle +420 721 212 719',
    })

  if (!avaiableBranches) return null
  return (
    <Swiper
      modules={[Virtual, Navigation, Pagination]}
      navigation={true}
      onSwiper={setSwiper}
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
      className='branch-swiper'
    >
      {avaiableBranches?.map((branch, index) => {
        const isBranchSelected = values.branch_id === branch.id
        return (
          <SwiperSlide
            key={branch.id}
            virtualIndex={index}
            onClick={() => {
              swiper.slideTo(index)

              if (isBranchSelected) {
                setFieldValue('branch_id', null)
                setFieldValue('branch_name', null)
              } else {
                setFieldValue('branch_id', branch.id)
                setFieldValue('branch_name', branch.name)
              }

              setFieldValue('time', null)
              setFieldValue('timeslot_id', null)
            }}
            className={clsx(
              isBranchSelected ? 'bg-yellow' : 'bg-white',
              'flex items-center justify-center cursor-pointer',
            )}
          >
            <div
              key={branch.id}
              className={clsx(
                'font-title h-34 xl:h-44 flex items-center bg-white text-14 justify-center text-center',
                isBranchSelected && 'bg-yellow',
              )}
            >
              {branch.name}
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
