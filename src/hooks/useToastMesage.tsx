import { useToast } from '@chakra-ui/react'
import { Toast } from 'components/shared/Toast'

export interface ToastMessageProps {
  status: 'success' | 'error'
  message?: string
  description?: string
  id?: string
  duration?: number
}

export const useToastMessage = () => {
  const toast = useToast()

  const showToast = ({
    status,
    message,
    description,
    id,
    duration,
  }: ToastMessageProps) => {
    let toastMessage = message
    if (status === 'success' && !toastMessage)
      toastMessage = 'Změny byly úspěšně uloženy.'

    if (status === 'error' && !toastMessage)
      toastMessage = 'Něco se nepovedlo - kontaktujte správce systému'

    toast({
      id: id,
      position: 'top',
      status: 'success',
      duration: duration || 4000,
      isClosable: true,
      render: () => (
        <Toast
          status={status}
          title={toastMessage ?? ''}
          description={description}
          onClose={toast.closeAll}
        />
      ),
    })
  }

  const isActive = (id: string) => {
    return toast.isActive(id)
  }

  return { showToast, isActive }
}
