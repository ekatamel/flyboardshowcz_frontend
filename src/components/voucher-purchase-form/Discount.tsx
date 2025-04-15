import { TextInput } from 'components/shared/form/TextInput'
import { InfoOverlay } from 'components/shared/InfoOverlay'
import { useFormikContext } from 'formik'
import { useToastMessage } from 'hooks/useToastMessage'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { Order, Response } from 'types/types'
import { validateDiscountCode } from 'utils/requests'
import {
  getDiscountDisabledMessage,
  getToastMessageForDiscount,
  removeDiscount,
} from 'utils/utils'

import { Button } from '../shared/Button'

export const Discount = () => {
  const { showToast } = useToastMessage()

  const { values, setFieldValue, setValues } = useFormikContext<Order>()

  const [value, setValue] = useState('')

  const { mutate: validateDiscount } = useMutation(validateDiscountCode, {
    onSuccess: data => {
      const status = data.code === 200 ? 'success' : 'error'
      const toastMessage = getToastMessageForDiscount(status, data)

      showToast({
        status: status,
        message: toastMessage.title,
        description: toastMessage.description,
      })
      if (status === 'success') {
        setFieldValue(
          'discountCodeId',
          data?.discount?.id ?? data.customer_discount.id,
        )
        setFieldValue('discountInfo', {
          code:
            data?.discount?.discount_code ??
            data.customer_discount.discount_code,
          discount:
            data?.discount?.discount_value ??
            data.customer_discount.discount_value,
          type:
            data?.discount?.discount_type ??
            data.customer_discount.discount_type,
        })
        setValue('')
      }
    },
    onError: (data: Response) => {
      showToast({
        status: 'error',
        message: data.message_headline,
      })
    },
  })

  const isDiscountApplied = !!values.discountCodeId && !!values.discountInfo
  const isLessonSelected = values.lessonType.length > 0
  const isDiscountCodeApplicable = !values.discountCodeId && isLessonSelected

  const toastMessage = getDiscountDisabledMessage(
    isLessonSelected,
    isDiscountApplied,
    true,
  )

  return (
    <div className='flex w-full items-center justify-center gap-20'>
      <label
        className='text-textGray font-title label text-16 whitespace-nowrap'
        htmlFor='discount'
      >
        Slevový kód
      </label>

      <InfoOverlay
        label={
          !isDiscountCodeApplicable ? (
            <p className='font-body text-12 lg:text-14 normal-case tracking-normal'>
              {toastMessage}
            </p>
          ) : null
        }
      >
        <TextInput
          id='discount'
          value={value}
          setValue={setValue}
          disabled={!isDiscountCodeApplicable}
          className='w-120'
        />
      </InfoOverlay>

      {isDiscountApplied ? (
        <Button
          title='Odebrat slevu'
          type='button'
          variant='primary'
          onClick={() => removeDiscount(values, setValues)}
          isRounded={false}
        />
      ) : (
        <Button
          title='Aplikovat'
          type='button'
          variant='primary'
          disabled={!isDiscountCodeApplicable || !value.trim()}
          onClick={() => validateDiscount(value)}
          isRounded={false}
        />
      )}
    </div>
  )
}
