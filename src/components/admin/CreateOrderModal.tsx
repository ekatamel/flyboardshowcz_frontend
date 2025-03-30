import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Formik, FormikErrors } from 'formik'
import { AdminOrder, AdminOrderPostType } from 'types/types'
import { ObjectSchema } from 'yup'

import { NewOrderForm } from './NewOrderForm'

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  addCustomers?: boolean
  formTitle: string
  validationSchema: () => ObjectSchema<any>
  initialValues: any
  validate?: ((
    values: AdminOrder,
  ) => void | object | Promise<FormikErrors<AdminOrder>>) &
    ((values: AdminOrder) => FormikErrors<AdminOrder>)
  mutatitonFn: (order: AdminOrderPostType) => Promise<any>
}

export const CreateOrderModal = ({
  isOpen,
  onClose,
  formTitle,
  addCustomers = true,
  validationSchema,
  initialValues,
  validate,
  mutatitonFn,
}: CreateOrderModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
      <ModalOverlay sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      <ModalContent color={'white'} border={'1px solid white'} borderRadius={0}>
        <ModalCloseButton color={'white'} />
        <ModalHeader
          className='font-title text-36 text-center'
          fontWeight={'normal'}
        >
          {formTitle}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={() => {}}
            validationSchema={validationSchema}
            validate={validate}
          >
            {() => (
              <NewOrderForm
                onClose={onClose}
                addCustomers={addCustomers}
                mutatitonFn={mutatitonFn}
              />
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
