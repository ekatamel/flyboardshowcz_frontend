import { SkeletonPage } from 'components/shared/SkeletonPage'
import { LessonType } from 'components/voucher-purchase-form/LessonsType'
import { useToastMessage } from 'hooks/useToastMesage'
import { useQuery } from 'react-query'
import { Lesson } from 'types/types'
import { fetchLessonConfiguration } from 'utils/requests'

export const Lessons = () => {
  const { showToast, isActive } = useToastMessage()

  const {
    data: lessons,
    isLoading,
    isError,
  } = useQuery<Lesson[]>('lessonConfiguration', fetchLessonConfiguration)

  const uniqueValidityDates = lessons?.reduce((acc: string[], lesson) => {
    if (!acc.includes(lesson.validity_voucher_to))
      acc.push(lesson.validity_voucher_to)
    return acc.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  }, [])

  if (isError && !isActive('lessons-error'))
    showToast({
      id: 'lessons-error',
      status: 'error',
      message: 'Nepodařilo se načíst lekce. Zkuste prosím později.',
    })

  if (isLoading || !uniqueValidityDates) return <SkeletonPage />

  return (
    <LessonType lessons={lessons} uniqueValidityDates={uniqueValidityDates} />
  )
}
