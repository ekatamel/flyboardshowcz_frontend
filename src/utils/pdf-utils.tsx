import { pdf } from '@react-pdf/renderer'
import { SingleVoucher } from 'components/voucher/VoucherPDF'
import { VoucherType } from 'types/types'

import { generateAndSendVouchers } from './requests'

export const sendPDFs = async (vouchers: VoucherType[]) => {
  const base64Voucher = vouchers.map(async (voucher: VoucherType) => {
    const blob = await pdf(<SingleVoucher voucher={voucher} />).toBlob()
    const reader = new FileReader()

    const base64data: string | ArrayBuffer | null = await new Promise(
      (resolve, reject) => {
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      },
    )

    return { code: voucher.code, base64: base64data }
  })

  const base64Vouchers = await Promise.all(base64Voucher)

  return generateAndSendVouchers(base64Vouchers)
}
