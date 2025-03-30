import { SmallAddIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import { AdminButton } from 'components/shared/AdminButton'
import { InfoOverlay } from 'components/shared/InfoOverlay'
import { InputError } from 'components/shared/InputError'
import { Field, Form, Formik, FormikErrors, useFormikContext } from 'formik'
import { useToastMessage } from 'hooks/useToastMesage'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import {
  AdminOrder,
  Reservation,
  ReservationMerch,
  ReservationState,
  UpdatedReservation,
} from 'types/types'
import { addNewExtrasForReservation, updateReservation } from 'utils/requests'
import {
  addExtrasValidationSchema,
  adminReservationSchema,
} from 'utils/validation-schemas'

import { CreateOrderModal } from './CreateOrderModal'

interface ExpandableReservationRowProps {
  reservation: Reservation
  toggleExpanded: () => void
  expandedIndex: number
}

export const ExpandableReservationRow = ({
  reservation,
  toggleExpanded,
  expandedIndex,
}: ExpandableReservationRowProps) => {
  const queryClient = useQueryClient()

  const { showToast } = useToastMessage()

  const { used_by, message, status } = reservation

  const { mutate: updateReservationData, isLoading } = useMutation(
    updateReservation,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('reservations')
        await queryClient.invalidateQueries('reservationsForDay')
        toggleExpanded()
        showToast({ status: 'success' })
      },
      onError: (error: any) =>
        showToast({
          status: 'error',
          message: error.message,
        }),
    },
  )

  const updateVoucherData = async (values: UpdatedReservation) => {
    // TODO check lower case value if changed
    const updatedReservationData = {
      customer_data: {
        id: used_by?.id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        instagram: values.instagram,
      },
      voucher_data: {
        id: reservation.id,
        message: values.message,
        status: values.status,
      },
    }

    updateReservationData(updatedReservationData)
  }

  const initialValues = {
    first_name: used_by?.first_name,
    last_name: used_by?.last_name,
    email: used_by?.email,
    phone_number: used_by?.phone_number,
    instagram: used_by?.instagram,
    message: message,
    status,
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validationSchema={adminReservationSchema}
    >
      <UpdateReservationForm
        reservation={reservation}
        toggleExpanded={toggleExpanded}
        updateVoucherData={updateVoucherData}
        isLoading={isLoading}
        expandedIndex={expandedIndex}
        initialValues={initialValues}
      />
    </Formik>
  )
}

interface UpdateReservationFormProps {
  reservation: Reservation
  toggleExpanded: () => void
  updateVoucherData: (values: UpdatedReservation) => void
  isLoading: boolean
  expandedIndex: number
  initialValues: UpdatedReservation
}

const UpdateReservationForm = ({
  reservation,
  toggleExpanded,
  updateVoucherData,
  isLoading,
  expandedIndex,
  initialValues,
}: UpdateReservationFormProps) => {
  const { errors, values, resetForm } = useFormikContext<UpdatedReservation>()

  const {
    merch,
    vouchers_count_on_order,
    extras,
    lesson_type_name: lessonType,
    code,
    used_by,
    id: voucherId,
  } = reservation

  const video = extras?.find(extra => extra.type === 'video')
  const extraMinutes = extras?.reduce((acc: number, extra) => {
    if (extra.type === 'minutes') acc = acc + 5 // 5 minutes
    return acc
  }, 0)

  useEffect(() => {
    resetForm({ values: initialValues })
  }, [expandedIndex, initialValues, resetForm])

  return (
    <Form>
      <div className='flex flex-col gap-12 lg:gap-30 lg:pt-22 lg:px-10 lg:pb-10'>
        <Customer />
        <Lesson lessonType={lessonType} lessonCode={code} />
        <Extras
          video={video}
          merch={merch}
          vouchersCount={vouchers_count_on_order}
          customerId={used_by.id}
          voucherId={voucherId}
          extraMinutes={extraMinutes ?? 0}
        />

        <div className='flex w-fit'>
          <label className='font-title text-yellow text-14 lg:text-16 shrink-0 w-60 lg:w-120'>
            Stav *
          </label>
          <Field
            as='select'
            name='status'
            className='w-full h-44 px-10 max-w-169 border bg-darkGray focus:outline-none focus:border-white text-white block border-yellow rounded text-14 lg:text-16 font-title'
          >
            <option value='' disabled>
              Vyber stav
            </option>
            {Object.keys(ReservationState).map(state => {
              const stateKey = state as keyof typeof ReservationState

              return (
                <option key={state} value={state}>
                  {ReservationState[stateKey]}
                </option>
              )
            })}
          </Field>
        </div>

        <div className='w-250 lg:w-400 flex'>
          <p className='font-title text-yellow text-14 lg:text-16 shrink-0 w-60 lg:w-120'>
            Poznámka
          </p>
          <Field
            as='textarea'
            type='text'
            name='message'
            className='w-full min-h-100 px-10 border bg-darkGray focus:outline-none focus:border-white text-white block border-yellow rounded text-14 lg:text-16 font-title py-6 resize-none'
          />
        </div>

        <div className='flex gap-20 justify-end'>
          <AdminButton
            title='Zrušit'
            className='bg-black border-yellow text-yellow'
            onClick={() => {
              resetForm()
              toggleExpanded()
            }}
          />
          <AdminButton
            title='Uložit'
            className='bg-yellow border-yellow text-black'
            onClick={() => updateVoucherData(values)}
            disabled={Object.keys(errors).length > 0 || isLoading}
          />
        </div>
      </div>
    </Form>
  )
}

const Customer = () => {
  const { errors, touched } = useFormikContext<UpdatedReservation>()

  return (
    <div className='flex'>
      <p className='font-title text-yellow w-60 lg:w-120 text-14 lg:text-16 shrink-0'>
        Zákazník
      </p>
      <div className='flex gap-10 lg:gap-30'>
        <div className='flex flex-col gap-4'>
          <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
            Jméno *
          </label>
          <Field
            type='text'
            name='first_name'
            className='w-full h-44 px-10 max-w-169 border bg-darkGray focus:outline-none focus:border-white text-white block border-yellow rounded text-14 lg:text-16 font-title'
          />
          {errors.first_name && touched.first_name && (
            <InputError errorText={errors.first_name || ''} />
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
            Příjmení *
          </label>
          <Field
            type='text'
            name='last_name'
            className='w-full h-44 px-10 max-w-169 border bg-darkGray focus:outline-none focus:border-white text-white block border-yellow rounded text-14 lg:text-16 font-title'
          />
          {errors.last_name && touched.last_name && (
            <InputError errorText={errors.last_name || ''} />
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
            Telefon
          </label>
          <Field
            type='text'
            name='phone_number'
            className='w-full h-44 px-10 max-w-169 border bg-darkGray focus:outline-none focus:border-white text-white block border-yellow rounded text-14 lg:text-16 font-title'
          />
          {errors.phone_number && touched.phone_number && (
            <InputError errorText={errors.phone_number || ''} />
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
            Email
          </label>
          <Field
            type='email'
            name='email'
            className='w-full h-44 px-10 max-w-169 border bg-darkGray focus:outline-none focus:border-white text-white block border-yellow rounded text-14 lg:text-16 font-title'
          />
          {errors.email && touched.email && (
            <InputError errorText={errors.email || ''} />
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
            Instagram
          </label>
          <Field
            type='text'
            name='instagram'
            className='w-full h-44 px-10 max-w-169 border bg-darkGray focus:outline-none focus:border-white text-white block border-yellow rounded text-14 lg:text-16 font-title'
          />
        </div>
      </div>
    </div>
  )
}

interface LessonProps {
  lessonType: string
  lessonCode: string
}

const Lesson = ({ lessonType, lessonCode }: LessonProps) => {
  return (
    <div className='flex'>
      <p className='font-title text-yellow w-60 lg:w-120 text-14 lg:text-16 shrink-0'>
        Lekce
      </p>
      <div className='flex gap-10 lg:gap-30'>
        <div className='flex flex-col gap-4'>
          <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
            Typ
          </label>
          <Field
            type='text'
            name='code'
            value={lessonType}
            className='w-full h-44 px-10 max-w-169 border bg-darkGray text-white block border-gray rounded text-14 lg:text-16 font-title'
            disabled
          />
        </div>
        <div className='flex flex-col gap-4'>
          <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
            Kód voucheru
          </label>
          <Field
            type='text'
            name='code'
            value={lessonCode}
            className='w-full h-44 px-10 max-w-169 border bg-darkGray text-white block border-gray rounded text-14 lg:text-16 font-title'
            disabled
          />
        </div>
      </div>
    </div>
  )
}
// TODO improve type
interface Extras {
  video:
    | {
        id: number
        name: string
        is_order_paid: boolean
        type: 'video' | 'minutes'
      }
    | undefined
  merch: ReservationMerch[] | undefined
  vouchersCount: number
  customerId: number
  voucherId: number
  extraMinutes: number
}

const Extras = ({
  video,
  merch,
  vouchersCount,
  customerId,
  voucherId,
  extraMinutes,
}: Extras) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialValues = {
    purchaseType: {
      lekce: false,
      video: true,
      merch: true,
      minutes: true,
    },
    payment: {
      payment_type: 'cash',
    },
    customer: {
      id: customerId,
    },
    voucher_id: voucherId,
  }

  const validate = (values: AdminOrder) => {
    const errors: FormikErrors<AdminOrder> = {}
    const { extras, merch } = values
    const hasExtras = !!extras
    const hasMerch = merch && merch.id
    if (!hasExtras && !hasMerch) {
      errors.merch = 'Zvol alespoň jednu položku extras nebo merche'
    }
    return errors
  }

  const groupedMerch =
    merch?.reduce((acc: Record<number, ReservationMerch>, merch) => {
      if (!acc[merch.id])
        acc[merch.id] = {
          ...merch,
          quantity: 0,
        }
      acc[merch.id].quantity++
      return acc
    }, {}) ?? []

  return (
    <div className='flex'>
      <p className='font-title text-yellow text-14 lg:text-16 shrink-0 w-60 lg:w-120'>
        Extras
      </p>
      <div className='flex gap-10 lg:gap-30 items-end'>
        {video && (
          <div className='flex flex-col gap-4'>
            <div className='flex gap-5'>
              <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
                Video
              </label>
              {!video.is_order_paid && (
                <InfoOverlay
                  fill='#FF0000'
                  label={
                    <p className='font-body text-12 lg:text-14 normal-case tracking-normal'>
                      Video nebylo zaplaceno
                    </p>
                  }
                />
              )}
            </div>
            <Field
              type='text'
              name='code'
              value={video.name}
              className='w-full h-44 px-10 max-w-169 border bg-darkGray text-white block border-gray rounded text-14 lg:text-16 font-title'
              disabled
            />
          </div>
        )}
        {extraMinutes > 0 && (
          <div className='flex flex-col gap-4'>
            <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap'>
              Extra minuty
            </label>
            <Field
              type='text'
              name='code'
              value={`+ ${extraMinutes}`}
              className='w-full h-44 px-10 max-w-169 border bg-darkGray text-white block border-gray rounded text-14 lg:text-16 font-title'
              disabled
            />
          </div>
        )}
        {merch && merch.length > 0 && (
          <div className='flex flex-col gap-4'>
            <div className='flex gap-5'>
              <label className='font-title text-yellow my-auto text-14 lg:text-16 whitespace-nowrap '>
                Merch
              </label>
              {vouchersCount > 1 && (
                <InfoOverlay
                  fill='#FF0000'
                  label={
                    <p className='font-body text-12 lg:text-14 normal-case tracking-normal'>
                      Objednávka má více voucherů, které mohou obsahovat merch
                    </p>
                  }
                />
              )}
            </div>
            <Field
              type='text'
              name='code'
              value={Object.values(groupedMerch)
                .map(merch => `${merch.quantity} x ${merch.name}`)
                .join(', ')}
              className='w-full h-44 px-10 max-w-169 border bg-darkGray text-white block border-gray rounded text-14 lg:text-16 font-title'
              disabled
            />
          </div>
        )}
        <button
          className='flex h-44 items-center gap-10 px-6 font-title text-12 text-black lg:px-16 lg:py-8 lg:text-14 bg-yellow'
          onClick={onOpen}
        >
          <SmallAddIcon
            boxSize={{
              base: 4,
              lg: 6,
            }}
          />
          Přidat extras
        </button>
        <CreateOrderModal
          isOpen={isOpen}
          onClose={onClose}
          addCustomers={false}
          formTitle={'Přidat extras'}
          validationSchema={addExtrasValidationSchema}
          initialValues={initialValues}
          validate={validate}
          mutatitonFn={addNewExtrasForReservation}
        />
      </div>
    </div>
  )
}
