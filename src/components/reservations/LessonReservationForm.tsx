import clsx from 'clsx'
import {
  FormNavigationContext,
  FormNavigationProvider,
} from 'context/ReservationFormNavigationContext'
import { Form, Formik } from 'formik'
import { AnimatePresence } from 'framer-motion'
import { useContext } from 'react'
import { reservationSchema } from 'utils/validation-schemas'

const initialValues = {}

export const LessonReservationForm = () => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={reservationSchema}
      onSubmit={() => {}}
    >
      {
        <FormNavigationProvider>
          <LessonReservation />
        </FormNavigationProvider>
      }
    </Formik>
  )
}

export const LessonReservation = () => {
  const { currentStepIndex, formSteps } = useContext(FormNavigationContext)

  return (
    <Form>
      <AnimatePresence>
        <div className={clsx(currentStepIndex === 7 ? 'bg-white' : 'bg-black')}>
          {formSteps[currentStepIndex]}
        </div>
      </AnimatePresence>
    </Form>
  )
}
