import clsx from 'clsx'
import { InputError } from 'components/shared/InputError'
import { Field, useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import { AdminOrder, FormFields, MerchInfo } from 'types/types'
import { fetchMerch } from 'utils/requests'
import { formatPrice } from 'utils/utils'

interface AddMerchProps {
  merchFields: FormFields[]
}

export const AddMerch = ({ merchFields }: AddMerchProps) => {
  const { data: merch } = useQuery<MerchInfo[]>('merch', fetchMerch)
  const { setFieldValue, values, errors, touched } =
    useFormikContext<AdminOrder>()

  const merchErrors = errors.merch as any
  const merchTouched = touched.merch as any

  const selectedMerch = merch?.find(m => m.id == values?.merch?.id)

  const hasSizes =
    !!selectedMerch?.available_sizes &&
    Object.keys(selectedMerch?.available_sizes).length > 0

  const handleChange = (e: ChangeEvent<HTMLSelectElement>, name: string) => {
    const { value } = e.target
    setFieldValue(name, value)
  }

  const filteredMerch = merch?.filter(merch => merch.price !== 0)

  return (
    <div className='flex-1'>
      <div className='flex flex-col justify-between mb-40 lg:mb-0 gap-10 lg:gap-0'>
        {merchFields.map(field => {
          if (!field.included || (field.name === 'size' && !hasSizes))
            return null

          return (
            <div key={field.name} className='lg:h-89 h-64 w-full'>
              <div className='block w-full'>
                <label
                  className={clsx(
                    'font-title text-textGray  w-150 my-auto text-14 lg:text-16',
                    field.label === 'Merch'
                      ? 'lg:text-yellow'
                      : 'lg:text-white',
                  )}
                >
                  {field.label} {field.required && '*'}
                </label>
                <Field
                  defaultValue={''}
                  className={clsx(
                    'w-full h-44 px-8 max-w-169 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16',
                  )}
                  name={`merch.${field.name}`}
                  as={field.type}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleChange(e, `merch.${field.name}`)
                  }
                >
                  <option value='' disabled>
                    {field.placeholder}
                  </option>
                  {field.name === 'id' &&
                    filteredMerch?.map(merch => (
                      <option key={merch.id} value={merch.id}>
                        {merch.name} ({formatPrice(merch.price)} Kč)
                      </option>
                    ))}
                  {field.name === 'size' &&
                    hasSizes &&
                    Object.values(selectedMerch.available_sizes).map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                </Field>
                {merchErrors?.[field.name] && merchTouched?.[field.name] && (
                  <InputError
                    errorText={(merchErrors[field.name] as string) || ''}
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
