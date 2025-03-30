import { InputError } from 'components/shared/InputError'
import { Field, useFormikContext } from 'formik'

export const AddPurchaseTypes = () => {
  const { values, setFieldValue, errors } = useFormikContext<any>()

  const purchaseTypeErrors = errors.purchaseType as any

  const handleCheckboxChange = (type: string) => {
    const newPurchaseType = { ...values.purchaseType }
    newPurchaseType[type] = !newPurchaseType[type]
    setFieldValue('purchaseType', newPurchaseType)
  }

  return (
    <div className='mt-10 flex gap-40'>
      {Object.keys(values.purchaseType).map(type => {
        return (
          <div className='flex gap-20 items-center' key={type}>
            <Field
              id={type}
              type='checkbox'
              className='w-24 h-24 accent-yellow'
              checked={values.purchaseType[type]}
              onChange={() => handleCheckboxChange(type)}
            />
            <label
              htmlFor={type}
              className='font-title text-yellow my-auto text-14 lg:text-16'
            >
              {type}
            </label>
          </div>
        )
      })}
      {purchaseTypeErrors && (
        <InputError errorText={purchaseTypeErrors || ''} />
      )}
    </div>
  )
}
