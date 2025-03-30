import { InputError } from 'components/shared/InputError'
import { Field, useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import { AdminOrder, ExtrasInfo, FormFields } from 'types/types'
import { formatPrice } from 'utils/utils'

interface AddExtrasProps {
  extrasFields: FormFields[]
  extras: ExtrasInfo[] | undefined
  minutesExtraId: number | undefined
}

export const AddExtras = ({ extrasFields, extras }: AddExtrasProps) => {
  const { setFieldValue, errors, touched } = useFormikContext<AdminOrder>()

  const extrasErrors = errors.extras as any
  const extrasTouched = touched.extras as any

  const filteredExtras = extras?.filter(
    extra => extra.price !== 0 && extra.type !== 'minutes',
  )

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setFieldValue('extras', { id: Number(value), quantity: 1 })
  }

  return (
    <div className='flex-1 mb-10'>
      <div className='flex flex-col gap-10 justify-between lg:mb-0'>
        {extrasFields.map(field => {
          if (!field.included) return null

          return (
            <div key={field.name} className='w-full'>
              <div className='block w-full'>
                <label className='font-title text-textGray lg:text-yellow w-150 my-auto text-14 lg:text-16'>
                  Video {field.required && '*'}
                </label>
                <Field
                  defaultValue={''}
                  className='w-full h-44 px-8 max-w-169 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                  name={`extras.${field.name}`}
                  as={field.type}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleChange(e)
                  }
                >
                  <option value='' disabled>
                    {field.placeholder}
                  </option>
                  {field.name === 'id' &&
                    filteredExtras?.map(extra => (
                      <option key={extra.id} value={extra.id}>
                        {extra.name} ({formatPrice(extra.price)} Kč)
                      </option>
                    ))}
                </Field>
                {extrasErrors?.[field.name] && extrasTouched?.[field.name] && (
                  <InputError
                    errorText={(extrasErrors[field.name] as string) || ''}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
