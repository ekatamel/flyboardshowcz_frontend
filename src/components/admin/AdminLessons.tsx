import { SmallAddIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { AdminTable } from 'components/shared/AdminTable'
import { Formik } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Lesson, Merchant } from 'types/types'
import {
  createLesson,
  deleteLesson,
  fetchLessons,
  fetchMerchants,
  updateLesson,
} from 'utils/requests'
import { getAdminLessonsTableColumns } from 'utils/table-config'
import { lessonValidationSchema } from 'utils/validation-schemas'

import { CreateOrEditAdminLesson } from './CreateOrEditAdminLesson'

export const AdminLessons = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const { showToast } = useToastMessage()
  const queryClient = useQueryClient()
  const { data: lessons } = useQuery<Lesson[]>('lessons', fetchLessons)

  const { data: merchants } = useQuery<Merchant[]>('merchants', fetchMerchants)

  const merchantsMap = new Map(
    merchants?.map(merchant => [merchant.id, merchant]),
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  const onEditClick = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    onOpen()
  }

  const onEditLessonClose = () => {
    setSelectedLesson(null)
    onClose()
  }

  const { mutate: deleteAdminLesson } = useMutation(deleteLesson, {
    onSuccess: async (data: any) => {
      showToast({
        status: data.status === 200 ? 'success' : 'error',
        message: data?.data?.message,
      })
      await queryClient.invalidateQueries('lessons')
    },
    onError: (error: any) => {
      showToast({
        status: 'error',
        message: error?.response?.data?.error,
      })
    },
  })

  const columns = getAdminLessonsTableColumns(
    deleteAdminLesson,
    merchantsMap,
    onEditClick,
  )

  const initialValues = {
    ...selectedLesson,
    length: selectedLesson?.product?.length,
    bullet_points_description: Object.values(
      selectedLesson?.bullet_points_description ?? {},
    ).join(';'),
    merchant_id: selectedLesson?.product?.merchant_id,
    type_lesson: selectedLesson?.type_lesson,
  }

  const sortedLessons = [...(lessons ?? [])].sort((a, b) => {
    if (a.active !== b.active) return Number(b.active) - Number(a.active)

    const merchantA = a.product?.merchant_id ?? 0
    const merchantB = b.product?.merchant_id ?? 0
    if (merchantA !== merchantB) return merchantA - merchantB

    const dateA = a.validity_voucher_to
      ? new Date(a.validity_voucher_to).getTime()
      : Infinity
    const dateB = b.validity_voucher_to
      ? new Date(b.validity_voucher_to).getTime()
      : Infinity

    return dateA - dateB
  })

  return (
    <div className='w-full'>
      <div className='mb-20 flex justify-between lg:mb-0'>
        <h1 className='text-white font-title text-26 lg:text-subtitle text-center lg:text-left mb-16'>
          Lekce
        </h1>
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
          Vytvořit lekci
        </button>
      </div>

      {sortedLessons && (
        <AdminTable
          data={sortedLessons}
          columns={columns}
          isFilterable={true}
          isExpandable={true}
        />
      )}
      <Modal isOpen={isOpen} onClose={onEditLessonClose} size={'2xl'}>
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
            Detail a úprava lekce
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={initialValues}
              onSubmit={() => {}}
              validationSchema={lessonValidationSchema}
            >
              <CreateOrEditAdminLesson
                merchantsMap={merchantsMap}
                onClose={onEditLessonClose}
                mutationFn={selectedLesson ? updateLesson : createLesson}
              />
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
