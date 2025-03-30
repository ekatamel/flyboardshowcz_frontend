import { SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import arrowLeft from 'assets/images/arrow-left.svg'
import logo from 'assets/images/logo-new.png'
import clsx from 'clsx'
import { Button } from 'components/shared/Button'
import { FormNavigationContext as ReservationContext } from 'context/ReservationFormNavigationContext'
import { FormNavigationContext as VoucherPurchaseContext } from 'context/VoucherFormNavigationContext'
import { motion } from 'framer-motion'
import { usePrompt } from 'hooks/usePrompt'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'

import { Progress } from './Progress'

interface LayoutProps {
  stepName: string
  title: string
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
  middleComponent?: React.ReactNode
  children?: React.ReactNode
  noNavigation?: boolean
  onPreviosStepClick?: () => void
  onNextStepClick?: () => void
  isLoading?: boolean
  isNextDisabled?: boolean
  disabledText?: string
  noProgress?: boolean
}

export const Layout = ({
  stepName,
  title,
  leftComponent,
  rightComponent,
  middleComponent,
  children,
  noNavigation = false,
  onPreviosStepClick,
  onNextStepClick,
  isLoading,
  isNextDisabled,
  disabledText,
  noProgress = false,
}: LayoutProps) => {
  const location = useLocation()

  const Context =
    location.pathname === '/nakup-voucheru'
      ? VoucherPurchaseContext
      : ReservationContext

  const {
    totalSteps,
    currentStepIndex,
    previousStepIndex,
    goToNextStep,
    goToPreviousStep,
  } = useContext(Context)

  usePrompt(currentStepIndex + 1 === totalSteps)
  const isNavigatingBackwards = currentStepIndex < previousStepIndex
  const xAnimationPosition = isNavigatingBackwards ? 600 : -600

  const animationSettings = {
    initial: { x: xAnimationPosition, opacity: 0.7 },
    exit: { x: -xAnimationPosition, opacity: 0.7 },
  }

  return (
    <motion.div
      initial={animationSettings.initial}
      animate={{ x: 0, opacity: 1 }}
      exit={animationSettings.exit}
      transition={{ duration: 0.2 }}
    >
      <div className='app-container flex min-h-screen flex-col bg-black pt-0 2xl:pt-84 3xl:items-center 4xl:pt-200'>
        <header className='mt-30 flex justify-between px-20 lg:mt-0 xl:px-127 2xl:mx-168 3xl:mx-0 3xl:w-[1600px]'>
          <a
            href='https://www.flyboardshow.cz/'
            target='_blank'
            rel='noreferrer'
          >
            <img src={logo} alt='Flyboard logo' className='h-70 lg:h-100' />
          </a>
          <div
            className={clsx(
              'mb-10 flex items-center justify-between',
              noProgress && 'hidden',
            )}
          >
            {isLoading ? (
              <SkeletonCircle
                size='10'
                startColor='gray.600'
                endColor='gray.1000'
              />
            ) : (
              <div>
                <Progress value={currentStepIndex + 1} total={totalSteps} />
              </div>
            )}
          </div>
        </header>
        <main className='relative flex grow flex-col xl:mx-224 xl:block 2xl:mx-450 3xl:mx-auto 3xl:w-1000'>
          <div className='sm:mx-44 md:mx-100 xl:mx-0 justify-between items-center mb-10 hidden sm:flex'>
            {isLoading ? (
              <SkeletonText
                className='w-100'
                mt='4'
                noOfLines={1}
                spacing='4'
                skeletonHeight='4'
                startColor='gray.600'
                endColor='gray.1000'
              />
            ) : (
              <p className='font-title text-base uppercase text-yellow '>
                {stepName}
              </p>
            )}
          </div>

          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-center'>
            <div
              className={clsx('flex-1', leftComponent && 'order-2 lg:order-1')}
            >
              {leftComponent}
            </div>
            <div
              className={clsx(
                'text-center grow',
                leftComponent && 'order-1 lg:order-2',
              )}
            >
              {isLoading ? (
                <SkeletonText
                  className='w-253'
                  mt='4'
                  noOfLines={1}
                  spacing='4'
                  skeletonHeight='10'
                  startColor='gray.600'
                  endColor='gray.1000'
                />
              ) : (
                <h1 className='text-white uppercase font-title xl:text-52 text-30'>
                  {title}
                </h1>
              )}
            </div>
            <div
              className={clsx(
                'flex-1 hidden lg:block',
                leftComponent && 'lg:order-3',
              )}
            >
              {rightComponent}
            </div>
          </div>

          {children}
        </main>
        <div
          className={clsx(
            'm-auto mx-20 flex flex-wrap items-center sm:mx-44 md:mx-80 md:flex-nowrap lg:mt-40 xl:mx-224 xl:mt-0 2xl:mx-450 3xl:mx-auto 3xl:w-1000',
            isLoading && 'justify-between',
          )}
        >
          {!noNavigation && !!stepName && (
            <Button
              title='Zpět'
              variant='secondary'
              position='left'
              onClick={() =>
                onPreviosStepClick ? onPreviosStepClick() : goToPreviousStep()
              }
              icon={arrowLeft}
              isLoading={isLoading}
              className='order-2'
            />
          )}
          {middleComponent}

          {((!noNavigation && currentStepIndex < totalSteps - 1) ||
            onNextStepClick) && (
            <Button
              title={
                stepName === 'Shrnutí'
                  ? location.pathname === '/nakup-voucheru'
                    ? 'Dokončit a zaplatit'
                    : 'Dokončit'
                  : 'Další krok'
              }
              variant='primary'
              position='right'
              onClick={() =>
                onNextStepClick ? onNextStepClick() : goToNextStep()
              }
              disabled={isNextDisabled}
              isLoading={isLoading}
              tooltip={disabledText}
              className='order-3'
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
