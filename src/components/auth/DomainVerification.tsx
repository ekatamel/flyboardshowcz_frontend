import { useQuery } from 'react-query'
import { getDomainVerificationFile } from 'utils/requests'

export const DomainVerification = () => {
  const { data } = useQuery('apple-domain', getDomainVerificationFile)

  return data
}
