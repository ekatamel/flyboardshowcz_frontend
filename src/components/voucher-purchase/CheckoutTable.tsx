import { Table, TableContainer, Tbody } from '@chakra-ui/react'
import clsx from 'clsx'
import { TableHead } from 'components/shared/TableHead'
import { FormNavigationContext } from 'context/VoucherFormNavigationContext'
import { FormikErrors, useFormikContext } from 'formik'
import { useGroupedProducts } from 'hooks/useGroupedProducts'
import { usePriceTotals } from 'hooks/usePriceTotals'
import { useContext } from 'react'
import { Order, PaymentOrigin, ProductType, Vouchers } from 'types/types'
import { formatPrice, getDiscountValue, removeDiscount } from 'utils/utils'

import { TableRow } from '../shared/TableRow'

interface CheckoutTable {
  isHeader?: boolean
  onProductDelete?: (type: ProductType, item: any) => void
  className?: string
  isTotalDivider?: boolean
  origin?: PaymentOrigin
  padding?: string
}

export const CheckoutTable = ({
  isHeader = false,
  onProductDelete,
  className,
  isTotalDivider,
  origin = PaymentOrigin.ORDER,
  padding,
}: CheckoutTable) => {
  const { values, setValues } = useFormikContext<Order | Vouchers>()
  const { totalDiscountedPrice, discountValue } = usePriceTotals()
  const { allProducts } = useGroupedProducts(origin)

  const { currentStepIndex } = useContext(FormNavigationContext)

  return (
    <TableContainer className='box-border'>
      <Table>
        {isHeader && (
          <TableHead data={['Lekce', 'Množství', 'Cena']} padding={padding} />
        )}
        <Tbody className='text-white font-title'>
          {allProducts.map(product => {
            const { type, id, name, quantity, discountedPrice } = product
            const isExtrasOrMerch = type === 'merch' || type === 'extras'
            const tableData = [
              `${isExtrasOrMerch ? '+' : ''} ${name} ${'size' in product ? `(Velikost ${product.size})` : ''}`,
              `${quantity}x`,
              `${formatPrice((discountedPrice ?? (product as any).price) * quantity)} CZK`,
            ]

            const isDeletable =
              product.discountedPrice !== 0 &&
              ((type === ProductType.LESSON && currentStepIndex === 0) ||
                type !== ProductType.LESSON)

            return (
              <TableRow
                key={`${type}-${id}`}
                onDelete={
                  isDeletable && onProductDelete
                    ? () => onProductDelete(type, product)
                    : undefined
                }
                data={tableData}
                className={className}
                padding={padding}
              />
            )
          })}
          {'discountCodeId' in values && (
            <TableRow
              data={[
                `Slevový kód (${values.discountInfo?.code})`,
                getDiscountValue(values.discountInfo),
                `-${discountValue} CZK`,
              ]}
              onDelete={() =>
                removeDiscount(
                  values,
                  setValues as (
                    values: React.SetStateAction<Order>,
                    shouldValidate?: boolean | undefined,
                  ) => Promise<void | FormikErrors<Order>>,
                )
              }
              className={clsx(className, 'text-yellow')}
              padding={padding}
            />
          )}
          <TableRow
            key={'Celkem'}
            data={['Celkem', '', `${totalDiscountedPrice} CZK`]}
            className={clsx(
              className,
              'text-textGray',
              isTotalDivider && 'border-t border-yellow',
            )}
            padding={padding}
          />
        </Tbody>
      </Table>
    </TableContainer>
  )
}
