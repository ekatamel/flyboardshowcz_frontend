import { InputError } from 'components/shared/InputError'
import { Field, useFormikContext } from 'formik'
import { AdminOrder, ExtrasInfo, FormFields } from 'types/types'

interface AddMinutesProps {
  fields: FormFields[]
  minutesExtra: ExtrasInfo
}

export const AddMinutes = ({ fields, minutesExtra }: AddMinutesProps) => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<AdminOrder>()
  const minutesErrors = errors.payment as any
  const minutesTouched = touched.payment as any

  const is5minSelected = !!values.minutes

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setFieldValue(
      'minutes',
      isChecked ? { id: minutesExtra.id, quantity: 1 } : null,
    )
  }

  return (
    <div className='flex flex-wrap flex-col lg:flex-row gap-10 justify-between mb-40 lg:mb-0 flex-1'>
      {fields.map(field => {
        if (!field.included) return null

        return (
          <div key={field.name} className='lg:h-89 h-64 w-full'>
            <div className='block w-full items-center'>
              <label className='font-title text-textGray lg:text-yellow w-150 my-auto text-14 lg:text-16'>
                {field.label} {field.required && '*'}
              </label>
              <div className='flex gap-10 mt-10'>
                <Field
                  checked={is5minSelected}
                  className='h-24 w-24 accent-yellow block'
                  name={`extras.${field.name}`}
                  type={'checkbox'}
                  placeholder={field.placeholder}
                  onChange={handleMinutesChange}
                />
                <label htmlFor={`extras.${field.name}`}>5 min</label>
              </div>
            </div>
            {minutesErrors?.[field.name] && minutesTouched?.[field.name] && (
              <InputError
                errorText={(minutesErrors[field.name] as string) || ''}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
