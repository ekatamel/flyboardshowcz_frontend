import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import clsx from 'clsx'
import { AdminButton } from 'components/shared/AdminButton'
import { InputError } from 'components/shared/InputError'
import { Field, Form, Formik } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Select from 'react-select'
import { Branch, Lector, Response } from 'types/types'
import { getTimeslotFormFields } from 'utils/form-config'
import { createTimeslot, fetchBranches, fetchLectors } from 'utils/requests'
import { selectStylesV2 } from 'utils/utils'
import { timeslotValidationSchema } from 'utils/validation-schemas'

interface CreateTimeslotModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateTimeslotModal = ({
  isOpen,
  onClose,
}: CreateTimeslotModalProps) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()
  const timeslotFormFields = getTimeslotFormFields()

  const [timeslotLectors, setTimeslotLectors] = useState<
    { value: number; label: string }[] | null
  >(null)

  const { data: branches } = useQuery<Branch[]>('branches', fetchBranches)
  const { data: lectors } = useQuery<Lector[]>('lectors', fetchLectors)

  const lectorsOptions = lectors?.map(
    ({ id, first_name, last_name, nickname }) => {
      return { value: id, label: `${first_name} ${last_name} (${nickname})` }
    },
  )

  const postNewTimeslot = (values: any) => {
    const timeslotData = {
      ...values,
      branch_id: Number(values.branch_id),
    }

    if (timeslotLectors && timeslotLectors.length > 0) {
      timeslotData.lecturers = timeslotLectors.map(lector => lector.value)
    }

    createNewTimeslot(timeslotData)
  }
  const { mutate: createNewTimeslot, isLoading } = useMutation(createTimeslot, {
    onSuccess: async data => {
      await queryClient.invalidateQueries('timeslots')
      const status = data.code === 200 ? 'success' : 'error'
      showToast({
        status,
        message:
          status === 'success'
            ? 'Termím byl úspěšně vytvořen'
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
          Nový termín
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{}}
            onSubmit={() => {}}
            validationSchema={timeslotValidationSchema}
          >
            {({ values, errors, touched }) => {
              return (
                <>
                  <Form className='flex flex-wrap flex-col lg:flex-row gap-10 justify-between mb-40 lg:mb-0'>
                    {timeslotFormFields.map(field => {
                      if (!field.included) return null
                      const fieldName = field.name as keyof typeof values
                      return (
                        <div
                          key={fieldName}
                          className={clsx(
                            'w-full h-fit',
                            field.type !== 'multi-select' && 'lg:w-5/12',
                          )}
                        >
                          <div className='block w-full'>
                            <label className='font-title text-textGray lg:text-white w-150 my-auto text-14 lg:text-16'>
                              {field.label} {field.required && '*'}
                            </label>
                            {(field.type === 'text' ||
                              field.type === 'number' ||
                              field.type === 'date' ||
                              field.type === 'time') && (
                              <Field
                                className='w-full h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                                name={fieldName}
                                type={field.type}
                                placeholder={field.placeholder}
                              />
                            )}
                            {field.type === 'select' && (
                              <Field
                                defaultValue={''}
                                className='w-full h-44 px-8 max-w-169 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                                name={fieldName}
                                as={field.type}
                              >
                                <option value='' disabled>
                                  {field.placeholder}
                                </option>
                                {branches?.map(branch => (
                                  <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                  </option>
                                ))}
                              </Field>
                            )}
                            {field.type === 'multi-select' && (
                              <Select
                                options={lectorsOptions}
                                isMulti
                                styles={selectStylesV2}
                                value={timeslotLectors}
                                onChange={(option: any) =>
                                  setTimeslotLectors(option)
                                }
                                className='w-full'
                              />
                            )}
                          </div>
                          {errors[fieldName] && touched[fieldName] && (
                            <InputError
                              errorText={(errors[fieldName] as string) || ''}
                            />
                          )}
                        </div>
                      )
                    })}
                  </Form>
                  <div className='flex gap-20 justify-between mb-16 mt-40'>
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
                      onClick={() => postNewTimeslot(values)}
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
