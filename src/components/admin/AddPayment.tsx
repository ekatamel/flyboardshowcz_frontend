import { InputError } from 'components/shared/InputError'
import { Field, useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import { AdminOrder, FormFields } from 'types/types'

interface AddPaymentProps {
  paymentFields: FormFields[]
}

export const AddPayment = ({ paymentFields }: AddPaymentProps) => {
  const { setFieldValue, errors, touched } = useFormikContext<AdminOrder>()
  const paymentErrors = errors.payment as any
  const paymentTouched = touched.payment as any

  return (
    <div>
      <p className='text-yellow font-title text-16 mb-10 lg:mt-30'>Platba</p>
      <div className='flex flex-wrap flex-col lg:flex-row gap-10 justify-between mb-40 lg:mb-0'>
        {paymentFields.map(field => {
          if (!field.included) return null

          return (
            <div key={field.name} className='lg:h-89 h-64 w-full lg:w-5/12'>
              <div className='block w-full'>
                <label className='font-title text-textGray lg:text-white w-150 my-auto text-14 lg:text-16'>
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' && (
                  <Field
                    defaultValue={''}
                    className='w-full h-44 px-8 max-w-169 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                    name={`payment.${field.name}`}
                    as={field.type}
                  >
                    <option value='' disabled>
                      {field.placeholder}
                    </option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                )}
                {field.type === 'number' && (
                  <Field
                    className='w-full h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                    name={`payment.${field.name}`}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFieldValue(
                        `payment.${field.name}`,
                        Number(e.target.value),
                      )
                    }
                  />
                )}
              </div>
              {paymentErrors?.[field.name] && paymentTouched?.[field.name] && (
                <InputError
                  errorText={(paymentErrors[field.name] as string) || ''}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
