import { ContentBox } from 'components/shared/ContentBox'
import { useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Virtual } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Lesson } from 'types/types'
import { bestSellerItemIds } from 'utils/utils'

const RECOMMENDED_LESSONS = ['1006', '1005', '1024', '1023']

interface LessonCarouselProps {
  lessons?: Lesson[]
  selectedValidityDate: string | null
}

export const LessonCarousel = ({
  lessons,
  selectedValidityDate,
}: LessonCarouselProps) => {
  const [swiper, setSwiper] = useState<any>(null)
  const [activeSlide, setActiveSlide] = useState(4)

  const bestSellerLessonIds = bestSellerItemIds.lessons

  const filteredLessons = lessons?.filter(lesson => {
    const {
      showtocustomer_from: showToCustomerFrom,
      showtocustomer_to: showToCustomerTo,
      validity_voucher_to: validityVoucherTo,
    } = lesson

    if (!showToCustomerFrom || !showToCustomerTo) return false

    return (
      new Date(showToCustomerFrom) < new Date() &&
      new Date(showToCustomerTo) > new Date() &&
      validityVoucherTo === selectedValidityDate
    )
  })

  const lessonSortedByPrice = filteredLessons?.sort((a, b) => {
    if (!a.price || !b.price) return 0
    return a.price - b.price
  })

  const handleSwiper = (swiper: any) => {
    setActiveSlide(swiper.activeIndex)
  }

  useEffect(() => {
    const recommendedLesson = lessonSortedByPrice?.findIndex(lesson =>
      RECOMMENDED_LESSONS.includes(lesson.lesson_type_code),
    )
    if (recommendedLesson && swiper?.mounted) swiper.slideTo(recommendedLesson)
  }, [swiper])

  return (
    <Swiper
      modules={[Virtual, Navigation, Pagination]}
      centeredSlides={true}
      spaceBetween={18}
      navigation={true}
      virtual
      onSwiper={setSwiper}
      onSlideChange={handleSwiper}
      className='lesson-swiper'
      breakpoints={{
        0: {
          slidesPerView: 1.5,
        },
        640: {
          slidesPerView: 2.3,
        },
        768: {
          slidesPerView: 3,
        },
      }}
    >
      {lessonSortedByPrice?.map((lesson, index) => (
        <SwiperSlide
          key={lesson.id}
          virtualIndex={index}
          onClick={() => swiper.slideTo(index)}
        >
          <ContentBox
            lesson={lesson}
            isSelected={index === activeSlide}
            isBestseller={bestSellerLessonIds.includes(lesson.id)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
