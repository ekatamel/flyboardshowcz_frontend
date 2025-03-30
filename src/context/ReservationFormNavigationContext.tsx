import { DateLocationSelector } from 'components/reservations/DateLocationSelector'
import { ReservationContacts } from 'components/reservations/ReservationContacts'
import { ReservationSummary } from 'components/reservations/ReservationSummary'
import { VoucherCodes } from 'components/reservations/VoucherCodes'
import { Extras } from 'components/voucher-purchase/Extras'
import { Payment } from 'components/voucher-purchase/Payment'
import { Success } from 'components/voucher-purchase/Success'
import React, { createContext, useState } from 'react'
import { PaymentOrigin } from 'types/types'

export interface FormNavigationContextType {
  currentStepIndex: number
  previousStepIndex: number
  goToNextStep: () => void
  goToPreviousStep: () => void
  formSteps: React.ReactNode[]
  totalSteps: number
}

export const FormNavigationContext = createContext<FormNavigationContextType>({
  currentStepIndex: 0,
  previousStepIndex: 0,
  goToNextStep: () => {},
  goToPreviousStep: () => {},
  formSteps: [],
  totalSteps: 0,
})

interface FormNavigationProviderProps {
  children: React.ReactNode
}

export function FormNavigationProvider({
  children,
}: FormNavigationProviderProps) {
  const formSteps = [
    <VoucherCodes key='voucherCodes' />,
    <DateLocationSelector key='dateLocationSelector' />,
    <ReservationContacts key='reservationContacts' />,
    <Extras key='reservationExtras' origin={PaymentOrigin.RESERVATION} />,
    <ReservationSummary key='reservationSummary' />,
    <Payment key='payment' origin={PaymentOrigin.RESERVATION} />,
    <Success key='reservationSuccess' origin={PaymentOrigin.RESERVATION} />,
  ]

  const [previousStepIndex, setPreviousStepIndex] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const goToNextStep = () => {
    setPreviousStepIndex(currentStepIndex)
    setCurrentStepIndex(currentStepIndex + 1)
  }

  const goToPreviousStep = () => {
    setPreviousStepIndex(currentStepIndex)
    setCurrentStepIndex(currentStepIndex - 1)
  }

  return (
    <FormNavigationContext.Provider
      value={{
        currentStepIndex,
        previousStepIndex,
        goToNextStep,
        goToPreviousStep,
        formSteps,
        totalSteps: formSteps.length,
      }}
    >
      {children}
    </FormNavigationContext.Provider>
  )
}
