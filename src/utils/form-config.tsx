import { Tooltip } from '@chakra-ui/react'
import { Alert } from 'assets/images/Alert'
import { ContactFormFields, FormFields, Merchant, NewUser } from 'types/types'

type FormFieldType = {
  label: string
  name: string
  type: 'text' | 'number' | 'select' | 'date' | 'textarea'
  placeholder?: string | null
  included: boolean
  required: boolean
  width: number
  options?: JSX.Element[]
  tooltip?: JSX.Element
}
export const getLessonFormFields = (
  merchantCode: string | undefined,
  merchants: Merchant[],
) => {
  return [
    {
      sectionId: 'detail',
      sectionName: 'Detail lekce',
      fields: [
        {
          label: 'Název',
          name: 'lesson_type_name',
          type: 'text',
          placeholder: 'Základní lekce',
          included: true,
          required: true,
          width: 46,
        },
        {
          label: 'Merchant',
          name: 'merchant_id',
          type: 'select',
          included: true,
          required: true,
          width: 46,
          options: merchants.map(merchant => (
            <option
              key={merchant.id}
              value={merchant.id}
              className='capitalize'
            >
              {merchant.code}
            </option>
          )),
        },
        {
          label: 'Typ lekce',
          name: 'type_lesson',
          type: 'select',
          included: true,
          required: false,
          width: 46,
          options: [
            <option key={'flyboard'} value={'flyboard'} className='capitalize'>
              Flyboard
            </option>,
            <option key={'other'} value={'other'} className='capitalize'>
              Jiné
            </option>,
          ],
        },
        {
          label: 'Kód lekce',
          name: 'lesson_type_code',
          type: 'text',
          included: merchantCode && merchantCode !== 'fbs',
          required: true,
          width: 46,
        },
        {
          label: 'Délka lekce',
          name: 'length',
          type: 'number',
          placeholder: 0,
          included: true,
          required: true,
          width: 46,
        },
        {
          label: 'Cena',
          name: 'price',
          type: 'number',
          placeholder: 0,
          included: merchantCode === 'fbs',
          required: true,
          width: 46,
        },
        {
          label: 'Sleva v %',
          name: 'discount',
          type: 'number',
          placeholder: 0,
          included: merchantCode === 'fbs',
          required: false,
          width: 46,
        },
        {
          label: 'Popis',
          name: 'top_level_description',
          type: 'textarea',
          placeholder: 'Zadejte popis lekce',
          included: merchantCode === 'fbs',
          required: true,
          width: 46,
        },
        {
          label: 'Bullet Points',
          name: 'bullet_points_description',
          placeholder: 'Zadejte bullet points',
          type: 'textarea',
          included: merchantCode === 'fbs',
          required: false,
          tooltip: (
            <Tooltip
              display={{ base: 'none', lg: 'block' }}
              label={<p>Jednotlivé bullet points rozděluj středníkem</p>}
            >
              <div className='flex gap-10'>
                <label className='font-title text-textGray lg:text-white my-auto text-14 lg:text-16'>
                  Bullet Points
                </label>
                <span>
                  <Alert className='w-20' />
                </span>
              </div>
            </Tooltip>
          ),
          width: 46,
        },
      ] as FormFieldType[],
    },
    {
      sectionId: 'validity',
      sectionName: 'Platnost a validita',
      fields: [
        {
          label: 'Ukazovat zákazníkům od',
          name: 'showtocustomer_from',
          type: 'date',
          included: merchantCode === 'fbs',
          required: false,
          width: 46,
          tooltip: (
            <Tooltip
              display={{ base: 'none', lg: 'block' }}
              label={<p>Pro FBS lekce je pole povinné</p>}
            >
              <div className='flex gap-10'>
                <label className='font-title text-textGray lg:text-white my-auto text-14 lg:text-16'>
                  Ukazovat zákazníkům od
                </label>
                <span>
                  <Alert className='w-20' />
                </span>
              </div>
            </Tooltip>
          ),
          placeholder: null,
        },
        {
          label: 'Ukazovat zákazníkům do',
          name: 'showtocustomer_to',
          type: 'date',
          included: merchantCode === 'fbs',
          required: false,
          width: 46,
          tooltip: (
            <Tooltip
              display={{ base: 'none', lg: 'block' }}
              label={<p>Pro FBS lekce je pole povinné</p>}
            >
              <div className='flex gap-10'>
                <label className='font-title text-textGray lg:text-white my-auto text-14 lg:text-16'>
                  Ukazovat zákazníkům do
                </label>
                <span>
                  <Alert className='w-20' />
                </span>
              </div>
            </Tooltip>
          ),
          placeholder: null,
        },
        {
          label: 'Validita voucheru od',
          name: 'validity_voucher_from',
          type: 'date',
          included: true,
          required: true,
          width: 46,
        },
        {
          label: 'Validita voucheru do',
          name: 'validity_voucher_to',
          type: 'date',
          included: true,
          required: true,
          width: 46,
        },
      ] as FormFieldType[],
    },
  ]
}

export const getOrderFormFields = () => {
  return {
    customer: [
      {
        label: 'Jméno',
        name: 'first_name',
        type: 'text',
        placeholder: 'Jan',
        included: true,
        required: true,
      },
      {
        label: 'Příjmení',
        name: 'last_name',
        type: 'text',
        placeholder: 'Novák',
        included: true,
        required: true,
      },
      {
        label: 'Email',
        name: 'email',
        type: 'text',
        placeholder: 'jan.novak@seznam.cz',
        included: true,
        required: false,
      },
      {
        label: 'Telefon',
        name: 'phone_number',
        type: 'text',
        placeholder: '+420 123 456 789',
        included: true,
        required: false,
      },
      {
        label: 'Instagram',
        name: 'instagram',
        type: 'text',
        placeholder: '@jan.novak',
        included: true,
        required: false,
      },
    ] as FormFields[],
    lesson: [
      {
        label: 'Lekce',
        name: 'code',
        type: 'select',
        placeholder: 'Vyberte lekci',
        included: true,
        required: true,
      },
      {
        label: 'Lokalita',
        name: 'branch_id',
        type: 'select',
        placeholder: 'Vyberte lokalitu',
        included: true,
        required: false,
      },
      {
        label: 'Datum a čas',
        name: 'datetime',
        type: 'datetime-local',
        placeholder: '',
        included: true,
        required: false,
      },
    ] as FormFields[],
    extras: [
      {
        label: 'Video',
        name: 'id',
        type: 'select',
        placeholder: 'Vyberte video',
        included: true,
        required: true,
      },
    ] as FormFields[],
    merch: [
      {
        label: 'Merch',
        name: 'id',
        type: 'select',
        placeholder: 'Vyberte merch',
        included: true,
        required: true,
      },
      {
        label: 'Velikost',
        name: 'size',
        type: 'select',
        placeholder: 'Vyberte velikost',
        included: true,
        required: true,
      },
    ] as FormFields[],
    minutes: [
      {
        label: 'Extra minuty',
        name: 'id',
        type: 'checkbox',
        included: true,
        required: false,
      },
    ] as FormFields[],
    payment: [
      {
        label: 'Typ platby',
        name: 'payment_type',
        type: 'select',
        placeholder: 'Vyberte typ platby',
        included: true,
        required: true,
        options: [
          { value: 'cash', label: 'Hotově' },
          { value: 'qr', label: 'QR' },
          { value: 'card', label: 'Kartou' },
        ],
      },
      {
        label: 'Částka',
        name: 'total_amount',
        type: 'number',
        included: true,
        required: true,
      },
    ] as FormFields[],
    info: {
      label: 'Dodatečné informace',
      name: 'message',
      type: 'text',
      placeholder: '',
      included: true,
      required: false,
    },
  }
}

export const getReservationFormFields = () => {
  return [
    {
      label: 'Uživatelské jméno',
      name: 'username',
      type: 'text',
      placeholder: 'petr_civin',
      included: true,
      required: true,
    },
    {
      label: 'Email',
      name: 'email' as keyof NewUser,
      type: 'email',
      placeholder: 'petr.civin@gmail.com',
      included: true,
      required: true,
    },
    {
      label: 'Telefon',
      name: 'phone_number' as keyof NewUser,
      type: 'text',
      placeholder: '+420 123 456 789',
      included: true,
      required: true,
    },
    {
      label: 'Jméno',
      name: 'first_name' as keyof NewUser,
      type: 'text',
      placeholder: 'Petr',
      included: true,
      required: true,
    },
    {
      label: 'Příjmení',
      name: 'last_name' as keyof NewUser,
      type: 'text',
      placeholder: 'Civín',
      included: true,
      required: true,
    },
    {
      label: 'Heslo',
      name: 'password' as keyof NewUser,
      type: 'password',
      placeholder: '',
      included: true,
      required: true,
    },
    {
      label: 'Potvrzení hesla',
      name: 'confirm_password' as keyof NewUser,
      type: 'password',
      placeholder: '',
      included: true,
      required: true,
    },
  ]
}

export const getContactFormFields = (otherKnowFrom: boolean) => {
  return [
    {
      label: 'Jméno',
      name: 'first_name',
      type: 'text',
      placeholder: 'Jan',
      included: true,
      required: true,
    },
    {
      label: 'Příjmení',
      name: 'last_name',
      type: 'text',
      placeholder: 'Novák',
      included: true,
      required: true,
    },
    {
      label: 'Email',
      name: 'email',
      type: 'text',
      placeholder: 'jan.novak@seznam.cz',
      included: true,
      required: true,
    },
    {
      label: 'Telefon',
      name: 'phone_number',
      type: 'text',
      placeholder: '+420 123 456 789',
      included: true,
      required: true,
    },
    {
      label: 'Jak jste se o nás dozvěděli?',
      name: 'know_from',
      type: 'select',
      included: true,
      required: true,
    },
    {
      label: 'Jiné',
      name: 'know_from',
      type: 'text',
      included: otherKnowFrom,
    },
  ] as ContactFormFields[]
}

export const getReservationContactFormFields = () => {
  return [
    {
      label: 'Jméno',
      name: 'first_name',
      type: 'text',
      placeholder: 'Jan',
      included: true,
      required: true,
    },
    {
      label: 'Příjmení',
      name: 'last_name',
      type: 'text',
      placeholder: 'Novák',
      included: true,
      required: true,
    },
    {
      label: 'Email',
      name: 'email',
      type: 'text',
      placeholder: 'jan.novak@seznam.cz',
      included: true,
    },
    {
      label: 'Telefon',
      name: 'phone_number',
      type: 'text',
      placeholder: '+420 123 456 789',
      included: true,
    },
    {
      label: 'Instagram',
      name: 'instagram',
      type: 'text',
      placeholder: '@jan.novak',
      included: true,
    },
    {
      label: 'Kontaktní osoba pro rezervaci',
      name: 'contact_person',
      type: 'checkbox',
      included: true,
    },
  ] as ContactFormFields[]
}

export const getDiscountFormFields = () => {
  return [
    {
      label: 'Kód slevy',
      name: 'discount_code',
      type: 'text',
      placeholder: 'leto20',
      included: true,
      required: true,
    },
    {
      label: 'Typ slevy',
      name: 'discount_type',
      type: 'select',
      placeholder: 'Vyberte typ slevy',
      included: true,
      required: true,
    },
    {
      label: 'Sleva',
      name: 'discount_value',
      type: 'number',
      placeholder: '10',
      included: true,
      required: true,
    },
    {
      label: 'Celkový Počet',
      name: 'quantity_stock',
      type: 'number',
      placeholder: '150',
      included: true,
      required: true,
    },
    {
      label: 'Zbývající Počet',
      name: 'quantity_remaining',
      type: 'number',
      placeholder: '100',
      included: true,
      required: true,
    },
    {
      label: 'Platnost od',
      name: 'valid_from',
      type: 'date',
      placeholder: '2024-01-10',
      included: true,
      required: true,
    },
    {
      label: 'Platnost do',
      name: 'valid_to',
      type: 'date',
      placeholder: '2024-12-31',
      included: true,
      required: true,
    },
  ] as FormFields[]
}

export const getLocationFormFields = () => {
  return [
    {
      label: 'Název lokace',
      name: 'name',
      type: 'text',
      placeholder: 'Jezero Lhota',
      included: true,
      required: true,
    },
    {
      label: 'Adresa',
      name: 'address',
      type: 'text',
      placeholder: '123 Main St, Cityvill',
      included: true,
      required: true,
    },
    {
      label: 'Latitude',
      name: 'lat',
      type: 'number',
      placeholder: '50.1234',
      included: true,
      required: true,
    },
    {
      label: 'Longitude',
      name: 'long',
      type: 'number',
      placeholder: '14.1234',
      included: true,
      required: true,
    },
    {
      label: 'Google maps URL',
      name: 'map_url',
      type: 'text',
      placeholder: 'https://www.google.com/maps',
      included: true,
      required: false,
    },
  ] as FormFields[]
}

export const getTimeslotFormFields = () => {
  return [
    {
      label: 'Lokalita',
      name: 'branch_id',
      type: 'select',
      placeholder: 'Vyberte lokalitu',
      included: true,
      required: true,
    },
    {
      label: 'Datum',
      name: 'date',
      type: 'date',
      placeholder: '',
      included: true,
      required: true,
    },

    {
      label: 'Od',
      name: 'start_hour',
      type: 'number',
      placeholder: 9,
      included: true,
      required: true,
    },
    {
      label: 'Do',
      name: 'end_hour',
      type: 'number',
      placeholder: 17,
      included: true,
      required: true,
    },
    {
      label: 'Pauza od',
      name: 'lunch_start',
      type: 'number',
      placeholder: 12,
      included: true,
      required: false,
    },
    {
      label: 'Pauza do',
      name: 'lunch_end',
      type: 'number',
      placeholder: 13,
      included: true,
      required: false,
    },
    {
      label: 'Počet skutrů',
      name: 'scooters',
      type: 'number',
      placeholder: '',
      included: true,
      required: true,
    },
    {
      label: 'Lektoři',
      name: 'lecturers',
      type: 'multi-select',
      placeholder: '',
      included: true,
      required: false,
    },
  ] as FormFields[]
}
