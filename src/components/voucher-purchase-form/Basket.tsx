import { Menu, MenuButton, MenuList, Portal } from '@chakra-ui/react'
import dropdownIcon from 'assets/images/dropdown.svg'
import { CheckoutTable } from 'components/voucher-purchase/CheckoutTable'
import { FormNavigationContext } from 'context/VoucherFormNavigationContext'
import { useFormikContext } from 'formik'
import { usePriceTotals } from 'hooks/usePriceTotals'
import { useContext } from 'react'
import { LessonType, Order, ProductType } from 'types/types'

export const Basket = () => {
  const { setValues } = useFormikContext<Order>()
  const { currentStepIndex } = useContext(FormNavigationContext)

  const { totalPrice, totalDiscountedPrice } = usePriceTotals()

  if (!parseFloat(totalPrice)) return null

  const onDelete = (type: ProductType, item: any) => {
    setValues(values => {
      if (type === 'lessonType') {
        if (currentStepIndex !== 0) return values
        const storedItems = [...values[type]]

        const itemIndexToDelete = storedItems.findIndex(storedItem => {
          return (storedItem as LessonType).code === (item as LessonType).code
        })

        if (itemIndexToDelete !== -1) storedItems.splice(itemIndexToDelete, 1)

        return {
          ...values,
          [type]: storedItems,
        }
      } else if (type === 'merch') {
        const merchToRemove = values.merch?.find(
          product => product.id === item.id,
        )

        return {
          ...values,
          [type]:
            merchToRemove && merchToRemove.quantity > 1
              ? values.merch?.map(product => ({
                  ...product,
                  quantity:
                    product.id === merchToRemove.id
                      ? product.quantity - 1
                      : product.quantity,
                }))
              : values.merch?.filter(product => product.id !== item.id),
        }
      } else {
        return {
          ...values,
          lessonType: values.lessonType.map(lesson => {
            return {
              ...lesson,
              extras: lesson.extras?.id === item.id ? undefined : lesson.extras,
            }
          }),
        }
      }
    })
  }

  return (
    <div className='flex items-center justify-end'>
      <>
        <Menu>
          <MenuButton className='shrink-0'>
            <div className='flex items-center'>
              <img
                src={dropdownIcon}
                alt='Dropdown icon'
                className='w-24 h-24 mr-8'
              />
              <span className='text-textGray font-title text-subheading mr-12'>
                CELKEM
              </span>
              <span className='text-white font-title text-30'>
                {totalDiscountedPrice},-
              </span>
            </div>
          </MenuButton>
          <Portal>
            <MenuList
              backgroundColor='black'
              borderRadius='0'
              padding={0}
              className='border border-yellow hidden lg:block'
            >
              <CheckoutTable onProductDelete={onDelete} padding={'10px 20px'} />
            </MenuList>
          </Portal>
        </Menu>
      </>
    </div>
  )
}
