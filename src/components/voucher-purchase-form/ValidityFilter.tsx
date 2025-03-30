import { Filter } from 'components/shared/Filter'
import { InfoOverlay } from 'components/shared/InfoOverlay'
import { format } from 'date-fns'
interface ValidityFilterProps {
  uniqueValidityDates?: string[]
  selectedValidityDate: string
  setSelectedValidityDate: (date: string) => void
}

export const ValidityFilter = ({
  uniqueValidityDates,
  selectedValidityDate,
  setSelectedValidityDate,
}: ValidityFilterProps) => {
  return (
    <div className='mt-20 xl:mt-0'>
      <h4 className='text-18 text-textGray font-title mb-20 flex gap-8 items-center justify-center xl:justify-start'>
        Expirace voucheru
        {uniqueValidityDates && uniqueValidityDates.length > 1 && (
          <InfoOverlay label={<ValidityTooltip />} />
        )}
      </h4>

      <div className='flex gap-12 justify-center'>
        {uniqueValidityDates?.map((validityDate, index) => {
          const isDiscountedPrice =
            uniqueValidityDates.length > 1 && index === 0
          return (
            <Filter
              key={validityDate}
              text={format(new Date(validityDate), 'dd.MM.yyyy')}
              filterLabel={isDiscountedPrice ? 'Zvýhodněná cena' : ''}
              selected={validityDate === selectedValidityDate}
              onClick={() => setSelectedValidityDate(validityDate)}
              isAnimated={isDiscountedPrice}
            />
          )
        })}
      </div>
    </div>
  )
}

const ValidityTooltip = () => {
  return (
    <div className='font-body text-12 lg:text-14 normal-case tracking-normal'>
      <b>Kratší doba platnosti:</b>
      <ul className='list-disc px-10 pb-10'>
        <li>Levnější ceny</li>
        <li>Méně lidí u vody - více soukromí</li>
      </ul>
      <b>Delší doba platnosti:</b>
      <ul className='list-disc px-10'>
        <li>Standardní cena</li>
        <li>Ideální jako dárkový voucher</li>
      </ul>
    </div>
  )
}
