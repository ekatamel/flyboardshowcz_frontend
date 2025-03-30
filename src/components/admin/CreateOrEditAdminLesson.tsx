import { Textarea, useMediaQuery } from '@chakra-ui/react'
import { AdminButton } from 'components/shared/AdminButton'
import { InputError } from 'components/shared/InputError'
import { Field, Form, useFormikContext } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useMutation, useQueryClient } from 'react-query'
import { AdminLesson, Merchant } from 'types/types'
import { getLessonFormFields } from 'utils/form-config'

interface CreateOrEditAdminLessonProps {
  merchantsMap: Map<number, Merchant>
  onClose: () => void
  mutationFn: (
    lesson: Omit<AdminLesson, 'bullet_points_description'> & {
      bullet_points_description: Record<string, string> | null
    },
  ) => Promise<any>
}

export const CreateOrEditAdminLesson = ({
  merchantsMap,
  onClose,
  mutationFn,
}: CreateOrEditAdminLessonProps) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastMessage()

  const { values, errors, touched, setFieldValue, dirty } =
    useFormikContext<AdminLesson>()

  const { mutate: createOrEditAdminLesson, isLoading } = useMutation(
    mutationFn,
    {
      onSuccess: async data => {
        const status = [200, 201].includes(data.code) ? 'success' : 'error'
        if (status === 'success') {
          showToast({ status: 'success' })
          onClose()
          await queryClient.invalidateQueries(['lessons'])
        } else {
          showToast({
            status: 'error',
            message: data.message,
          })
        }
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message
        showToast({
          status: 'error',
          message: errorMessage,
        })
      },
    },
  )

  const createOrUpdateAdminLesson = () => {
    const bulletPoints = values.bullet_points_description
      ?.split(';')
      .reduce((acc: Record<string, string>, bulletPoint, index) => {
        acc[`b${index + 1}`] = bulletPoint
        return acc
      }, {})

    const updatedValues = {
      id: values.id ?? null,
      lesson_type_name: values.lesson_type_name,
      type_lesson: values.type_lesson ?? null,
      product_code_stripe: values.product_code_stripe,
      price: values.price,
      discount: values.discount,
      bullet_points_description: bulletPoints ?? null,
      top_level_description: values.top_level_description,
      showtocustomer_from: values.showtocustomer_from,
      showtocustomer_to: values.showtocustomer_to,
      validity_voucher_from: values.validity_voucher_from,
      validity_voucher_to: values.validity_voucher_to,
      length: values.length,
      merchant_id: values.merchant_id,
      description: null,
      lesson_type_code: values?.lesson_type_code,
    }
    return createOrEditAdminLesson(updatedValues)
  }

  const isSubmitDisabled = Object.keys(errors).length > 0 || isLoading || !dirty

  const lessonFormFields = getLessonFormFields(
    merchantsMap.get(values?.merchant_id)?.code,
    Array.from(merchantsMap.values()),
  )

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    fieldName: string,
  ) =>
    setFieldValue(
      fieldName,
      !isNaN(Number(e.target.value)) && e.target.value.trim() !== ''
        ? Number(e.target.value)
        : e.target.value,
    )

  const [isLgBreakpoint] = useMediaQuery('(min-width: 1024px)')

  return (
    <Form>
      {lessonFormFields.map(section => (
        <div key={section.sectionId} className='mb-20'>
          <p className='text-yellow font-title text-16 mb-10'>
            {section.sectionName}
          </p>
          <div className='flex flex-wrap flex-col lg:flex-row gap-0 justify-between mb-30 lg:mb-0'>
            {section.fields.map(field => {
              const {
                tooltip,
                name,
                width,
                type,
                label,
                required,
                placeholder,
                included,
                options,
              } = field
              if (!included) return null
              return (
                <div
                  key={name}
                  className='mb-10'
                  style={{ width: isLgBreakpoint ? `${width}%` : '100%' }}
                >
                  <div className={`block w-full`}>
                    {tooltip ? (
                      tooltip
                    ) : (
                      <label className='font-title text-textGray lg:text-white w-150 my-auto text-14 lg:text-16'>
                        {label} {required ? '*' : ''}
                      </label>
                    )}
                    {type === 'select' ? (
                      <select
                        defaultValue={''}
                        className='w-full h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                        name={name}
                        value={values[name as 'merchant_id' | 'type_lesson']}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          handleSelectChange(e, name)
                        }
                      >
                        <>
                          <option value='' disabled>
                            Vyber možnost
                          </option>
                          {options}
                        </>
                      </select>
                    ) : (
                      <Field
                        className='w-full h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        as={type === 'textarea' ? Textarea : null}
                      />
                    )}
                  </div>
                  {(errors as any)?.[name] &&
                    ((touched as any)?.[name] ||
                      name.includes('showtocustomer')) && (
                      <InputError
                        errorText={((errors as any)[name] as string) || ''}
                      />
                    )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div className='flex gap-20 justify-between mb-16 mt-20'>
        <AdminButton
          title='Zrušit'
          className='bg-black border-yellow text-yellow'
          onClick={onClose}
        />
        <AdminButton
          title='Uložit'
          className='bg-yellow border-yellow text-black'
          disabled={isSubmitDisabled}
          onClick={() => createOrUpdateAdminLesson()}
        />
      </div>
    </Form>
  )
}
