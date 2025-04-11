import { Skeleton } from '@chakra-ui/react'
import { Layout } from 'components/shared/layout/Layout'
import { SkeletonCarousel } from 'components/shared/loading/SkeletonCarousel'

export const SkeletonPage = () => {
  return (
    <Layout stepName='' title='' isLoading={true}>
      <Skeleton
        height={'40px'}
        startColor='gray.900'
        endColor='gray.1000'
        className='mb-60'
      />
      <SkeletonCarousel />
    </Layout>
  )
}
