import { DownloadIcon } from '@chakra-ui/icons'
import { AxiosResponse } from 'axios'
import { LoadingSpinner } from 'components/shared/LoadingSpinner'
import { useToastMessage } from 'hooks/useToastMesage'
import { useMutation } from 'react-query'
import { Response } from 'types/types'

interface CsvExportProps {
  csvFileName?: string
  mutationFn: () => Promise<AxiosResponse<any, any>>
}

export const CsvExport = ({ mutationFn, csvFileName }: CsvExportProps) => {
  const { showToast } = useToastMessage()

  const { mutate: exportCsv, isLoading } = useMutation(mutationFn, {
    onSuccess: data => {
      const status = data.status === 200 ? 'success' : 'error'

      if (status === 'success') {
        const csvContent = data.data

        // Create a Blob from the CSV string
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)

        // Create a link and trigger download
        const a = document.createElement('a')
        a.href = url
        a.download = csvFileName || 'export.csv'
        document.body.appendChild(a)
        a.click()

        // Clean up after download
        URL.revokeObjectURL(url)
        document.body.removeChild(a)

        showToast({
          status,
          message: 'Export dat proběhl úspěšně',
        })
      } else {
        showToast({
          status: 'error',
        })
      }
    },
    onError: (data: Response) => {
      showToast({
        status: 'error',
        message: data.message,
      })
    },
  })

  return (
    <button
      className='flex h-40 items-center gap-10 border border-yellow px-6 font-title text-12 text-yellow lg:w-100 lg:px-16 lg:py-8 lg:text-14'
      onClick={() => !isLoading && exportCsv()}
    >
      {isLoading ? (
        <LoadingSpinner size={'sm'} />
      ) : (
        <DownloadIcon
          boxSize={{
            base: 2,
            lg: 4,
          }}
        />
      )}
      Export
    </button>
  )
}
