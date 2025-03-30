import { InputError } from 'components/shared/InputError'
import { Layout } from 'components/shared/Layout'
import { Field, useFormikContext } from 'formik'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { KnowFrom, Order } from 'types/types'
import { getContactFormFields } from 'utils/form-config'
import { fetchKnowFrom } from 'utils/requests'

import { Basket } from '../voucher-purchase-form/Basket'

export const Contact = () => {
  const { values, setValues, errors, touched } = useFormikContext<Order>()

  const { data: knowFromSources } = useQuery<KnowFrom[]>(
    'knowFrom',
    fetchKnowFrom,
  )

  const [otherKnowFrom, setOtherKnowFrom] = useState(false)

  const handleValueChange = (name: string, value: string) =>
    setValues(() => ({
      ...values,
      customer: {
        ...values.customer,
        [name]: value,
      },
    }))

  const contactFormFields = getContactFormFields(otherKnowFrom)

  return (
    <Layout
      stepName='Kontakt'
      title='Kontaktní údaje'
      rightComponent={<Basket />}
      isNextDisabled={Object.keys(errors).length > 0}
    >
      <p className='m-auto mx-20 mb-40 mt-20 flex flex-col text-center text-14 text-white sm:mx-44 lg:mx-0 lg:text-16'>
        <span>Dost o obdarovávaném... Kdo nám to tu nakupuje?</span>
        <span>
          Zkontroluj si správně vyplněný email. Právě tam Ti dárkový voucher
          přijde :).
        </span>
      </p>
      <div className='mx-20 mb-40 flex flex-col flex-wrap justify-between gap-10 sm:mx-44 md:mx-80 lg:mb-0 lg:flex-row lg:gap-30 xl:mx-0'>
        {contactFormFields.map((field, index) => {
          if (!field.included) return null
          return (
            <div
              key={`${field.name}-${index}`}
              className='h-64 w-full lg:h-89 lg:w-5/12'
            >
              <div className='flex lg:block'>
                <label className='my-auto w-150 font-title text-14 text-textGray lg:text-16 lg:text-white'>
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'text' && (
                  <Field
                    className='max-w-169 block h-44 w-full rounded border border-white bg-black px-10 font-body text-16 text-white focus:border-yellow focus:outline-none'
                    name={`customer.${field.name}`}
                    placeholder={field.placeholder}
                  />
                )}
                {field.type === 'select' && (
                  <Field
                    defaultValue={''}
                    className='max-w-169 block h-44 w-full rounded border border-white bg-black px-8 font-body text-16 text-white focus:border-yellow focus:outline-none'
                    name={`customer.${field.name}`}
                    as={field.type}
                    value={
                      otherKnowFrom ? 'other' : values.customer?.[field.name]
                    }
                    onChange={(e: any) => {
                      const selectedValue = e.target.value

                      if (selectedValue === 'Jiné') {
                        setOtherKnowFrom(true)
                        handleValueChange(field.name, '')
                      } else {
                        setOtherKnowFrom(false)
                        handleValueChange(field.name, selectedValue)
                      }
                    }}
                  >
                    <option value='' key={0}>
                      Vyberte z následujících možností
                    </option>
                    {knowFromSources?.map((data, index) => {
                      return (
                        <option key={index} value={data.know_from}>
                          {data.know_from}
                        </option>
                      )
                    })}
                  </Field>
                )}
              </div>

              {errors.customer?.[field.name] &&
                touched.customer?.[field.name] && (
                  <InputError errorText={errors.customer?.[field.name] || ''} />
                )}
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
