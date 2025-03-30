import {
  FormNavigationContext,
  FormNavigationProvider,
} from 'context/VoucherFormNavigationContext'
import { Form, Formik } from 'formik'
import { AnimatePresence } from 'framer-motion'
import { useContext } from 'react'
import { orderSchema } from 'utils/validation-schemas'

const initialValues = {
  hasVoucher: false,
  lessonType: [],
  customer: {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  },
}

export const VoucherPurchaseForm = () => {
  return (
    <FormNavigationProvider>
      <Formik
        initialValues={initialValues}
        validationSchema={orderSchema}
        onSubmit={() => {}}
      >
        <VoucherPurchase />
      </Formik>
    </FormNavigationProvider>
  )
}

export const VoucherPurchase = () => {
  const { currentStepIndex, formSteps } = useContext(FormNavigationContext)

  return (
    <Form>
      <AnimatePresence>
        <div className='bg-black'>{formSteps[currentStepIndex]}</div>
      </AnimatePresence>
    </Form>
  )
}
