import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormikProvider } from 'formik'

import { Discount } from './Discount'

jest.mock('axios')

const mockedMutate = jest.fn()
const mockSetValues = jest.fn()

jest.mock('react-query', () => ({
  useMutation: () => ({
    mutate: mockedMutate,
    isLoading: false,
    isError: false,
    data: undefined,
    error: undefined,
  }),
}))

jest.mock('hooks/useToastMessage', () => ({
  useToastMessage: () => ({
    showToast: jest.fn(),
  }),
}))

jest.mock('components/shared/InfoOverlay', () => ({
  InfoOverlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const defaultValues = {
  discountInfo: null,
  discountCodeId: null,
  lessonType: [
    {
      id: 6,
      name: 'Doporučená lekce',
      code: '1006',
      price: 1999,
      discountedPrice: 1799.1,
      discount: 10,
      merch: [],
      voucherName: '',
      validTill: '2025-06-01',
    },
  ],
}
const TestDiscount = ({ values }: { values?: any }) => {
  return (
    <FormikProvider
      value={
        {
          values: values ?? defaultValues,
          setValues: mockSetValues,
          setFieldValue: jest.fn(),
        } as any
      }
    >
      <Discount />
    </FormikProvider>
  )
}

describe(Discount, () => {
  it('renders empty Discount with disabled input and Apply button, if lesson is not selected', () => {
    render(<TestDiscount values={{ ...defaultValues, lessonType: [] }} />)

    const discountInput = screen.getByLabelText('Slevový kód')
    const applyButton = screen.getByRole('button')

    expect(discountInput).toBeInTheDocument()
    expect(discountInput).toHaveValue('')
    expect(discountInput).toBeDisabled()
    expect(applyButton).toBeInTheDocument()
    expect(applyButton.textContent).toBe('Aplikovat')
    expect(applyButton).toBeDisabled()
  })

  it('makes input enabled for typing, if lesson was selected', () => {
    render(<TestDiscount />)

    const discountInput = screen.getByLabelText('Slevový kód')

    expect(discountInput).toBeEnabled()
  })

  it('should display discount code typed by user and enable Apply button', async () => {
    render(<TestDiscount />)

    const discountInput = screen.getByLabelText('Slevový kód')
    const applyButton = screen.getByRole('button')

    await userEvent.type(discountInput, 'APPLIED')

    expect(discountInput).toHaveValue('APPLIED')
    expect(applyButton).toBeEnabled()
  })

  it('should not enable Apply button if user types empty string', async () => {
    render(<TestDiscount />)

    const discountInput = screen.getByLabelText('Slevový kód')
    const applyButton = screen.getByRole('button')

    await userEvent.type(discountInput, '     ')

    expect(discountInput).toHaveValue('     ')
    expect(applyButton).toBeDisabled()
  })

  it('calls mutation fn when Apply button is clicked', async () => {
    render(<TestDiscount />)

    const discountInput = screen.getByLabelText('Slevový kód')
    const applyButton = screen.getByRole('button')

    await userEvent.type(discountInput, 'APPLIED')
    await act(async () => {
      await userEvent.click(applyButton)
    })

    expect(mockedMutate).toHaveBeenCalled()
  })

  it('shows Remove Discount button if discount was applied', () => {
    render(
      <TestDiscount
        values={{
          ...defaultValues,
          discountCodeId: 3,
          discountInfo: {
            code: 'faktuplnezdarma',
            discount: 100,
            type: 'price',
          },
        }}
      />,
    )

    const discountInput = screen.getByLabelText('Slevový kód')
    const removeDiscountButton = screen.getByRole('button')

    expect(discountInput).toBeDisabled()
    expect(removeDiscountButton).toBeInTheDocument()
    expect(removeDiscountButton.textContent).toBe('Odebrat slevu')
    expect(removeDiscountButton).toBeEnabled()
  })

  it('calls setValues with removed discount on Remove discount button click', async () => {
    render(
      <TestDiscount
        values={{
          ...defaultValues,
          discountCodeId: 3,
          discountInfo: {
            code: 'faktuplnezdarma',
            discount: 100,
            type: 'price',
          },
        }}
      />,
    )

    const removeDiscountButton = screen.getByRole('button')

    await userEvent.click(removeDiscountButton)

    const { discountCodeId, discountInfo, ...rest } = defaultValues

    expect(mockSetValues).toHaveBeenCalledWith(rest)
  })

  // TODO add test scenarious:
  // 1. Displaying toast messages
  // 2. Error cases
  // 3. Loading states
  // 4. Field Value Updates
  // 5. Test Input Clearing
})
