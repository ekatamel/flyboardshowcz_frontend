import { Contact } from 'components/voucher-purchase/Contact'
import { Extras } from 'components/voucher-purchase/Extras'
import { Lessons } from 'components/voucher-purchase/Lessons'
import { Merch } from 'components/voucher-purchase/Merch'
import { Payment } from 'components/voucher-purchase/Payment'
import { Success } from 'components/voucher-purchase/Success'
import { Summary } from 'components/voucher-purchase/Summary'
import { VoucherName } from 'components/voucher-purchase/VoucherName'
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
    <Lessons key='lessons' />,
    <VoucherName key='voucherName' />,
    <Contact key='contact' />,
    <Extras key='extras' origin={PaymentOrigin.ORDER} />,
    <Merch key='merch' />,
    <Summary key='summary' />,
    <Payment key='payment' origin={PaymentOrigin.ORDER} />,
    <Success key='success' origin={PaymentOrigin.ORDER} />,
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
