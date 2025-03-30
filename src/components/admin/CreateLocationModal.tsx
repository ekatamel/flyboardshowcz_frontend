import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { AdminButton } from 'components/shared/AdminButton'
import { InputError } from 'components/shared/InputError'
import { Field, Form, Formik } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useMutation, useQueryClient } from 'react-query'
import { Response } from 'types/types'
import { getLocationFormFields } from 'utils/form-config'
import { createBranch } from 'utils/requests'
import { locationValidationSchema } from 'utils/validation-schemas'

interface CreateLocationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateLocationModal = ({
  isOpen,
  onClose,
}: CreateLocationModalProps) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()
  const locationFormFields = getLocationFormFields()

  const { mutate: createNewBranch, isLoading } = useMutation(createBranch, {
    onSuccess: async data => {
      await queryClient.invalidateQueries('branches')
      const status = data.code === 200 ? 'success' : 'error'
      showToast({
        status,
        message:
          status === 'success'
            ? 'Lokalita byla úspěšně vytvořena'
            : 'Něco se pokazilo',
      })
      onClose()
    },
    onError: (data: Response) => {
      showToast({
        status: 'error',
        message: data.message_headline,
      })
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      <ModalContent color={'white'} border={'1px solid white'} borderRadius={0}>
        <ModalCloseButton color={'white'} />
        <ModalHeader
          className='font-title text-36 text-center'
          fontWeight={'normal'}
        >
          Nová lokalita
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{}}
            onSubmit={() => {}}
            validationSchema={locationValidationSchema}
          >
            {({ values, errors, touched }) => {
              return (
                <>
                  <Form className='flex flex-wrap flex-col lg:flex-row gap-10 justify-between mb-40 lg:mb-0'>
                    {locationFormFields.map(field => {
                      if (!field.included) return null
                      const fieldName = field.name as keyof typeof values
                      return (
                        <div
                          key={fieldName}
                          className='lg:h-89 h-64 w-full lg:w-5/12'
                        >
                          <div className='block w-full'>
                            <label className='font-title text-textGray lg:text-white w-150 my-auto text-14 lg:text-16'>
                              {field.label} {field.required && '*'}
                            </label>
                            {(field.type === 'text' ||
                              field.type === 'number') && (
                              <Field
                                className='w-full h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                                name={fieldName}
                                type={field.type}
                                placeholder={field.placeholder}
                              />
                            )}
                          </div>
                          {errors[fieldName] && touched[fieldName] && (
                            <InputError errorText={errors[fieldName] || ''} />
                          )}
                        </div>
                      )
                    })}
                  </Form>
                  <div className='flex gap-20 justify-between mb-16 mt-20'>
                    <AdminButton
                      title='Zrušit'
                      className='bg-black border-yellow text-yellow'
                      onClick={onClose}
                    />
                    <AdminButton
                      title='Uložit'
                      className='bg-yellow border-yellow text-black'
                      disabled={
                        Object.keys(values).length === 0 ||
                        Object.keys(errors).length > 0 ||
                        isLoading
                      }
                      onClick={() => createNewBranch(values as any)}
                    />
                  </div>
                </>
              )
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
