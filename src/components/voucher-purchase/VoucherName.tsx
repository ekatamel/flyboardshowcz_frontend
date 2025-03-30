import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  useDisclosure,
} from '@chakra-ui/react'
import heart from 'assets/images/heart.png'
import moustache from 'assets/images/moustache.png'
import spy from 'assets/images/spy.png'
import voucherSreenshot from 'assets/images/voucher-screen.png'
import { Button } from 'components/shared/Button'
import { InfoOverlay } from 'components/shared/InfoOverlay'
import { InputError } from 'components/shared/InputError'
import { Layout } from 'components/shared/Layout'
import { TableHead } from 'components/shared/TableHead'
import { TableRow } from 'components/shared/TableRow'
import { Voucher } from 'components/voucher/Voucher'
import { format } from 'date-fns'
import { Field, FormikErrors, useFormikContext } from 'formik'
import { useMemo } from 'react'
import { LessonType, Order } from 'types/types'

import { Basket } from '../voucher-purchase-form/Basket'

export const VoucherName = () => {
  const { values, errors } = useFormikContext<Order>()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isVoucherNamePresent = useMemo(() => {
    return values.lessonType.every(lessonType => !!lessonType.voucherName)
  }, [values.lessonType])

  return (
    <Layout
      stepName='Voucher'
      title='Jméno na voucher'
      rightComponent={<Basket />}
      middleComponent={
        <div className='my-40 ml-auto flex w-full grow sm:my-0 md:w-fit md:basis-8/12 xl:block order-1 md:order-2'>
          <Button
            title='Náhled na voucher'
            position='center'
            variant='primary'
            onClick={onOpen}
            isRounded={false}
          />
        </div>
      }
      isNextDisabled={!isVoucherNamePresent || !!errors.lessonType}
    >
      <div className='mx-auto mt-20 flex w-fit gap-30 px-20 text-14 xl:px-0 xl:text-16'>
        <p className='flex items-center gap-10 pb-8 text-white'>
          <img src={heart} alt='Clock icon' className='w-24' />
          <span>Miláček?</span>
        </p>
        <p className='flex items-center gap-10 pb-8 text-white'>
          <img src={moustache} alt='Location icon' className='w-30' />
          <span>Pro tatínka?</span>
        </p>
        <p className='flex items-center gap-10 pb-8 text-white'>
          <img src={spy} alt='Foot icon' className='w-24' />
          <span>Petr Novák?</span>
        </p>
      </div>
      <p className='mt-10 px-44 text-center text-12 text-white xl:px-0 xl:text-16'>
        Uveď přesné znění, které se má objevit na voucheru.
      </p>
      <TableContainer className='mx-20 sm:mx-44 md:mx-80 xl:mx-0 mt-20 xl:mt-40'>
        <Table>
          <TableHead
            data={[
              <div className='flex items-center gap-4' key='lessonName'>
                Lekce{' '}
                <InfoOverlay
                  label={
                    <p className='font-body text-12 normal-case tracking-normal lg:text-14'>
                      Přejete si nakoupit více voucherů? Vyberte si lekce v
                      předhozím kroku.
                    </p>
                  }
                />
              </div>,
              'Platnost do',
              <div className='flex items-center gap-4' key='customerName'>
                Jméno{' '}
                <InfoOverlay
                  label={
                    <p className='font-body text-12 normal-case tracking-normal lg:text-14'>
                      Jméno se zobrazí na dárkovém voucheru
                    </p>
                  }
                />
              </div>,
            ]}
            noBorder={true}
            padding={'12px 0px'}
          />
          <Tbody className='font-title text-white'>
            {values.lessonType.map((lesson, index) => (
              <VoucherNameRow
                key={`${lesson.id}-${index}`}
                lesson={lesson}
                index={index}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{
          base: 'full',
          xl: 'full',
        }}
      >
        <ModalOverlay sx={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
        <ModalContent className='lg:w-[65vw]'>
          <ModalCloseButton color={'white'} />
          <ModalBody
            className='flex items-center justify-center'
            padding={{
              base: '60px 5px',
              lg: '30px 5px',
            }}
          >
            <div className='h-fit border border-yellow xl:mt-40 hidden xl:block'>
              <Voucher />
            </div>

            <div className='w-595 xl:hidden border border-yellow'>
              <img
                src={voucherSreenshot}
                alt='Voucher example'
                className='object-contain'
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <div className='m-auto mb-40 lg:mr-40'>
              <Button
                title='Zavřít'
                variant='primary'
                position='right'
                onClick={onClose}
              />
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}

interface VoucherNameRowProps {
  lesson: LessonType
  index: number
}
export const VoucherNameRow = ({ lesson, index }: VoucherNameRowProps) => {
  const { errors, touched } = useFormikContext<Order>()

  const data = [
    lesson.name,
    <div className='flex items-center' key='validTill'>
      {format(new Date(lesson.validTill), 'dd.MM.yyyy')}
    </div>,
    <div className='relative' key='customerName'>
      <Field
        className='max-w-169 block h-34 w-full rounded border border-white bg-black px-8 font-body text-16 text-white focus:border-yellow focus:outline-none lg:h-44'
        name={`lessonType[${index}].voucherName`}
        placeholder='Petr Novák'
      />
      {(errors.lessonType as FormikErrors<LessonType>[])?.[index] &&
        touched.lessonType?.[index]?.voucherName && (
          <InputError
            errorText={
              (errors.lessonType as FormikErrors<LessonType>[])?.[index]
                ?.voucherName || ''
            }
          />
        )}
    </div>,
  ]

  return (
    <TableRow
      key={index}
      data={data}
      className={'text-16 lg:text-20 mb-10'}
      padding={'12px 0px'}
    />
  )
}
