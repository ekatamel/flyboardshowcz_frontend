import { InputError } from 'components/shared/InputError'
import { Field, useFormikContext } from 'formik'
import { FormFields } from 'types/types'

interface AddCustomerProps {
  customerFields: FormFields[]
}

export const AddCustomer = ({ customerFields }: AddCustomerProps) => {
  const { errors, touched } = useFormikContext<any>()
  const customerErrors = errors.customer as any
  const customerTouched = touched.customer as any
  return (
    <>
      <p className='text-yellow font-title text-16 mb-10'>Zákazník</p>

      <div className='flex flex-wrap flex-col lg:flex-row gap-10 justify-between mb-30 lg:mb-0'>
        {customerFields.map(field => {
          if (!field.included) return null

          return (
            <div key={field.name} className='lg:h-89 h-64 w-full lg:w-5/12'>
              <div className='block w-full'>
                <label className='font-title text-textGray lg:text-white w-150 my-auto text-14 lg:text-16'>
                  {field.label} {field.required && '*'}
                </label>
                <Field
                  className='w-full h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                  name={`customer.${field.name}`}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              </div>
              {customerErrors?.[field.name] &&
                customerTouched?.[field.name] && (
                  <InputError
                    errorText={(customerErrors[field.name] as string) || ''}
                  />
                )}
            </div>
          )
        })}
      </div>
    </>
  )
}
