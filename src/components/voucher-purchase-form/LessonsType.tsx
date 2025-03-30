import { Layout } from 'components/shared/Layout'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lesson, Order } from 'types/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Basket } from './Basket'
import { Discount } from './Discount'
import { LessonCarousel } from './LessonCarousel'
import { ValidityFilter } from './ValidityFilter'

interface LessonTypeProps {
  lessons?: Lesson[]
  uniqueValidityDates: string[]
}
export const LessonType = ({
  lessons,
  uniqueValidityDates,
}: LessonTypeProps) => {
  const navigate = useNavigate()

  const [selectedValidityDate, setSelectedValidityDate] = useState<string>(
    uniqueValidityDates[0],
  )

  const { values } = useFormikContext<Order>()

  return (
    <Layout
      stepName='Typ lekce'
      title='Vyber typ lekce'
      leftComponent={
        <ValidityFilter
          uniqueValidityDates={uniqueValidityDates}
          selectedValidityDate={selectedValidityDate}
          setSelectedValidityDate={setSelectedValidityDate}
        />
      }
      rightComponent={<Basket />}
      middleComponent={
        <div className='mb-24 flex w-full justify-between sm:mx-0 md:mb-0 xl:mb-0 order-1 md:order-2'>
          <Discount />
        </div>
      }
      onPreviosStepClick={() => navigate('/')}
      isNextDisabled={values.lessonType.length === 0}
    >
      <LessonCarousel
        lessons={lessons}
        selectedValidityDate={selectedValidityDate}
      />
    </Layout>
  )
}
