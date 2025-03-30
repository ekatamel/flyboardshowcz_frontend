import clsx from 'clsx'
import { InputError } from 'components/shared/InputError'
import { Layout } from 'components/shared/Layout'
import { SimpleCarousel } from 'components/shared/SimpleCarousel'
import { Field, FormikErrors, FormikTouched, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { Voucher, Vouchers } from 'types/types'
import { getReservationContactFormFields } from 'utils/form-config'

import { DateTimeInfo } from './DateTimeInfo'

export const ReservationContacts = () => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<Vouchers>()

  const [contactIndex, setContactIndex] = useState(0)

  const contactFormFields = getReservationContactFormFields()
  const voucher = values.vouchers[contactIndex]

  const contactPersonVoucherIndex = values.vouchers.findIndex(
    voucher => voucher.customer?.contact_person === 1,
  )

  useEffect(() => {
    if (contactPersonVoucherIndex === -1)
      setFieldValue('vouchers[0].customer.contact_person', 1)
  }, [contactPersonVoucherIndex, setFieldValue])

  const contactPerson: Voucher | undefined = values.vouchers.find(
    voucher => voucher.customer?.contact_person === 1,
  )
  const contactCustomer = contactPerson?.customer

  const isFormReadyToSubmit =
    Object.keys(errors).length === 0 &&
    !!contactPerson &&
    !!contactCustomer?.email &&
    !!contactCustomer?.phone_number

  const error = errors.vouchers?.[contactIndex] as FormikErrors<Voucher>
  const touchedInput = touched.vouchers?.[
    contactIndex
  ] as FormikTouched<Voucher>

  return (
    <Layout
      stepName='Letci'
      title='S kým se potkáme?'
      middleComponent={<DateTimeInfo />}
      isNextDisabled={!isFormReadyToSubmit}
    >
      <p className='mb-40 mt-20 px-20 text-center text-14 text-white sm:px-44 md:px-80 lg:mt-38 lg:px-100 lg:text-16 xl:mt-10 xl:px-0'>
        Prosím, sdělte nám, koho potkáme a přidejte email a telefon pro případné
        technické problémy nebo změny rezervace. Alespoň jedna osoba musí být
        označená jako kontaktní. Zmiňte také váš Instagram a zúčastněte se
        slosování o LET ZDARMA!
      </p>
      <SimpleCarousel
        item={
          <div className='flex'>
            <p className='mr-8 font-title text-20 text-white'>
              {voucher.lesson_name}
            </p>
            <p className='font-title text-20 text-yellow'>
              {voucher.voucher_code}
            </p>
          </div>
        }
        itemsNumber={values.vouchers.length}
        index={contactIndex}
        setIndex={setContactIndex}
        className='-top-[90%] left-[45%]'
      />

      <div className='mx-20 mb-10 flex flex-col flex-wrap justify-between gap-10 sm:mx-44 md:mx-80 lg:mb-0 lg:flex-row lg:gap-30 xl:mx-0 xl:gap-10'>
        {contactFormFields.map(field => {
          const { type, required, label, placeholder, name } = field
          const isCheckbox = type === 'checkbox'
          const isRequired =
            required ||
            ((name === 'email' || name === 'phone_number') &&
              values.vouchers[contactIndex].customer?.contact_person === 1)
          return (
            <div
              key={`${name}-${contactIndex}`}
              className={'h-64 w-full lg:h-89 lg:w-5/12'}
            >
              <div
                className={clsx(
                  'flex',
                  isCheckbox
                    ? 'mt-10 flex-row-reverse items-center justify-center gap-20 lg:mt-36 lg:justify-end'
                    : 'lg:block',
                )}
              >
                <label className='my-auto w-150 whitespace-nowrap font-title text-16 text-textGray lg:text-white'>
                  {label} {isRequired && '*'}
                </label>
                {type === 'text' && (
                  <Field
                    type='text'
                    className='max-w-169 block h-44 w-full rounded border border-white bg-black px-10 font-body text-16 text-white focus:border-yellow focus:outline-none'
                    name={`vouchers[${contactIndex}].customer.${name}`}
                    placeholder={placeholder}
                  />
                )}

                {isCheckbox && (
                  <Field
                    checked={
                      values.vouchers[contactIndex].customer?.contact_person ===
                      1
                    }
                    type='checkbox'
                    className='h-24 w-24 accent-yellow'
                    name={`vouchers[${contactIndex}].customer.${name}`}
                    placeholder={placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const isChecked = e.target.checked

                      setFieldValue(
                        `vouchers[${contactIndex}].customer.${name}`,
                        isChecked ? 1 : 0,
                      )

                      if (isChecked) {
                        values.vouchers.forEach((_, idx) => {
                          if (idx !== contactIndex) {
                            setFieldValue(
                              `vouchers[${idx}].customer.${name}`,
                              0,
                            )
                          }
                        })
                      }
                    }}
                  />
                )}
              </div>
              {type === 'checkbox' &&
                values.vouchers.every(
                  voucher => !voucher?.customer?.contact_person,
                ) && (
                  <InputError
                    errorText={'Vyber jednu kontaktní osobu pro rezervaci'}
                    className={'ml-45 text-center lg:text-left'}
                  />
                )}

              {error?.customer?.[name] && touchedInput?.customer?.[name] && (
                <InputError errorText={error.customer?.[name] || ''} />
              )}
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
