import * as Yup from 'yup'

export const orderSchema = Yup.object().shape({
  customer: Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .min(2, 'Příliš krátké!')
      .max(50, 'Příliš dlouhé!')
      .required('Povinné pole'),
    last_name: Yup.string()
      .trim()
      .min(2, 'Příliš krátké!')
      .max(50, 'Příliš dlouhé!')
      .required('Povinné pole'),
    email: Yup.string().email('Nevalidní email').required('Povinné pole'),
    phone_number: Yup.string()
      .required('Povinné pole')
      .matches(/^(?:\+?\d{1,4})?\d{9,15}$/, 'Nevalidní telefonní číslo'),
    know_from: Yup.string()
      .trim()
      .min(2, 'Příliš krátké!')
      .required('Povinné pole'),
  }),
  lessonType: Yup.array().of(
    Yup.object().shape({
      voucherName: Yup.string()
        .required('Povinné pole')
        .trim()
        .min(2, 'Příliš krátké!')
        .max(50, 'Příliš dlouhé!'),
    }),
  ),
})

export const reservationSchema = Yup.object().shape({
  date: Yup.string().required(),
  branch_id: Yup.number().required(),
  slots_required: Yup.number().required(),
  vouchers: Yup.array()
    .of(
      Yup.object().shape({
        voucher_code: Yup.string().required(),
        customer: Yup.object().shape({
          first_name: Yup.string().required('Povinné pole'),
          last_name: Yup.string().required('Povinné pole'),
          email: Yup.string()
            .email('Nevalidní email')
            .when('contact_person', {
              is: 1,
              then: schema => schema.required('Povinné pole'),
            }),

          phone_number: Yup.string()
            .matches(/^(?:\+?\d{1,4})?\d{9,15}$/, 'Nevalidní telefonní číslo')
            .when('contact_person', {
              is: 1,
              then: schema => schema.required('Povinné pole'),
            }),
          contact_person: Yup.number().oneOf([0, 1]),
        }),
      }),
    )
    .test(
      'contact-person-check',
      'Vyber jednu kontaktní osobu pro rezervaci',
      vouchers =>
        vouchers?.some(voucher => voucher.customer.contact_person === 1),
    ),
})

export const adminReservationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(50, 'Příliš dlouhé!')
    .required('Povinné pole'),
  last_name: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(50, 'Příliš dlouhé!')
    .required('Povinné pole'),
  email: Yup.string().email('Nevalidní email').nullable(),
  phone_number: Yup.string()
    .matches(/^(?:\+?\d{1,4})?\d{9,15}$/, 'Nevalidní telefonní číslo')
    .nullable(),
  instagram: Yup.string().trim().nullable(),
  message: Yup.string().trim().nullable(),
  status: Yup.string().required('Povinné pole'),
})

export const timeslotValidationSchema = Yup.object().shape({
  branch_id: Yup.number().required('Povinné pole'),
  date: Yup.date().required('Povinné pole').typeError('Neplatné datum'),
  scooters: Yup.number().required('Povinné pole'),
  start_hour: Yup.number()
    .required('Povinné pole')
    .min(0, 'Hodina musí být mezi 0 a 23')
    .max(23, 'Hodina musí být mezi 0 a 23'),
  end_hour: Yup.number()
    .required('Povinné pole')
    .min(0, 'Hodina musí být mezi 0 a 23')
    .max(23, 'Hodina musí být mezi 0 a 23'),
  lunch_start: Yup.number()
    .min(0, 'Hodina musí být mezi 0 a 23')
    .max(23, 'Hodina musí být mezi 0 a 23'),
  lunch_end: Yup.number()
    .min(0, 'Hodina musí být mezi 0 a 23')
    .max(23, 'Hodina musí být mezi 0 a 23'),
  lectors: Yup.array(),
})

export const discountValidationSchema = Yup.object().shape({
  discount_code: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(20, 'Příliš dlouhé!')
    .required('Povinné pole'),
  discount_type: Yup.string()
    .oneOf(['price', 'min'], 'Neplatný typ slevy')
    .required('Povinné pole'),
  discount_value: Yup.number().required('Povinné pole'),
  quantity_stock: Yup.number().required('Povinné pole'),
  quantity_remaining: Yup.number()
    .required('Povinné pole')
    .test(
      'is-less-than-quantity_stock',
      'Zůstatek nesmí být větší než celkové množství',
      function (value) {
        return value <= this.parent.quantity_stock
      },
    ),
  valid_from: Yup.date()
    .required('Povinné pole')
    .test(
      'is-before-valid_to',
      'Datum "OD" musí být před datem "DO"',
      function (value) {
        const { valid_to } = this.parent
        return valid_to ? new Date(value) < new Date(valid_to) : true
      },
    ),
  valid_to: Yup.date()
    .required('Povinné pole')
    .test(
      'is-after-valid_from',
      'Datum "DO" musí být po datu "OD"',
      function (value) {
        const { valid_from } = this.parent
        return valid_from ? new Date(value) > new Date(valid_from) : true
      },
    ),
})

export const locationValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(20, 'Příliš dlouhé!')
    .required('Povinné pole'),
  address: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .required('Povinné pole'),
  lat: Yup.number().min(2, 'Příliš krátké!').required('Povinné pole'),
  long: Yup.number().min(2, 'Příliš krátké!').required('Povinné pole'),
  map_url: Yup.string().min(2, 'Příliš krátké!'),
})

export const orderValidationSchema = () => {
  return Yup.object().shape({
    purchaseType: Yup.object()
      .shape({
        lekce: Yup.boolean(),
        video: Yup.boolean(),
        merch: Yup.boolean(),
      })
      .test(
        'atLeastOneIsTrue',
        'Vyber alespoň jednu položku',
        value => value.lekce || value.video || value.merch,
      ),
    customer: Yup.object().shape({
      first_name: Yup.string()
        .trim()
        .min(2, 'Příliš krátké!')
        .max(50, 'Příliš dlouhé!')
        .required('Povinné pole'),
      last_name: Yup.string()
        .trim()
        .min(2, 'Příliš krátké!')
        .max(50, 'Příliš dlouhé!')
        .required('Povinné pole'),
      email: Yup.string().email('Nevalidní email'),
      phone_number: Yup.string().matches(
        /^(?:\+?\d{1,4})?\d{9,15}$/,
        'Nevalidní telefonní číslo',
      ),
      instagram: Yup.string().trim().min(2, 'Příliš krátké!'),
    }),
    lesson: Yup.object().shape({
      code: Yup.string().when('$purchaseType.lekce', {
        is: true,
        then: schema => schema.required('Povinné pole'),
      }),
      branch_id: Yup.string().nullable(),
      datetime: Yup.string().matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        'Neplatný formát data a času. Správný formát je YYYY-MM-DDTHH:MM',
      ),
    }),
    extras: Yup.object().shape({
      id: Yup.number().when('$purchaseType.video', {
        is: true,
        then: schema => schema.required('Povinné pole'),
      }),
      quantity: Yup.number(),
    }),
    merch: Yup.object().shape({
      id: Yup.string().when('$purchaseType.merch', {
        is: true,
        then: schema => schema.required('Povinné pole'),
      }),
      size: Yup.string(),
    }),
    payment: Yup.object().shape({
      payment_type: Yup.string().required('Povinné pole'),
      total_amount: Yup.number()
        .required('Povinné pole')
        .moreThan(0, 'Částka musí být větší než 0'),
    }),
    info: Yup.object().shape({
      message: Yup.string().trim().nullable(),
    }),
  })
}

export const addExtrasValidationSchema = () => {
  return Yup.object()
    .shape({
      extras: Yup.object().shape({
        id: Yup.number(),
        quantity: Yup.number(),
      }),
      merch: Yup.object().shape({
        id: Yup.number(),
        size: Yup.string(),
      }),
      payment: Yup.object().shape({
        payment_type: Yup.string().required('Povinné pole'),
        total_amount: Yup.number()
          .required('Povinné pole')
          .moreThan(0, 'Částka musí být větší než 0'),
      }),
      minutes: Yup.object().shape({
        id: Yup.number(),
        quantity: Yup.number(),
      }),
    })
    .test(
      'at-least-one-of-extras-or-merch',
      'Musí být vyplněno alespoň jedno pole: extras nebo merch',
      (value: any) => {
        const { extras, merch } = value
        const hasExtras = extras && extras.length > 0
        const hasMerch = merch && merch.id

        return hasExtras || hasMerch
      },
    )
}

export const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(20, 'Příliš dlouhé!')
    .required('Povinné pole'),
  password: Yup.string().trim().required('Povinné pole'),
})

export const registrationValidationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(20, 'Příliš dlouhé!')
    .required('Povinné pole'),
  email: Yup.string().email('Nevalidní email').required('Povinné pole'),
  phone_number: Yup.string()
    .required('Povinné pole')
    .matches(/^(?:\+?\d{1,4})?\d{9,15}$/, 'Nevalidní telefonní číslo'),
  first_name: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(50, 'Příliš dlouhé!')
    .required('Povinné pole'),
  last_name: Yup.string()
    .trim()
    .min(2, 'Příliš krátké!')
    .max(50, 'Příliš dlouhé!')
    .required('Povinné pole'),
  password: Yup.string()
    .trim()
    .min(6, 'Příliš krátké, min 6 znaků')
    .required('Povinné pole'),
  confirm_password: Yup.string()
    .trim()
    .required('Povinné pole')
    .oneOf([Yup.ref('password')], 'Hesla se musí shodovat'),
})

const FBS_MERCHANT_ID = 1

// TODO add validation that date TO must be after date FROM
export const lessonValidationSchema = Yup.object().shape({
  lesson_type_name: Yup.string()
    .trim()
    .min(5, 'Příliš krátké!')
    .required('Povinné pole'),
  type_lesson: Yup.string().nullable(),
  price: Yup.number()
    .moreThan(0, 'Částka musí být větší než 0')
    .nullable()
    .when('merchant_id', {
      is: FBS_MERCHANT_ID,
      then: schema => schema.required('Povinné pole'),
    }),
  lesson_type_code: Yup.string()
    .nullable()
    .when('merchant_id', {
      is: (value: number) => value !== FBS_MERCHANT_ID,
      then: schema => schema.required('Povinné pole'),
    }),
  discount: Yup.number().nullable(),
  bullet_points_description: Yup.string().trim().nullable(),
  top_level_description: Yup.string()
    .trim()
    .min(5, 'Příliš krátké!')
    .when('merchant_id', {
      is: FBS_MERCHANT_ID,
      then: schema => schema.required('Povinné pole'),
    }),
  showtocustomer_from: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD')
    .test(
      'is-valid-date',
      'Invalid date',
      value => !value || !isNaN(Date.parse(value)),
    )
    .nullable()
    .when('merchant_id', {
      is: FBS_MERCHANT_ID,
      then: schema => schema.required('Povinné pole'),
    }),
  showtocustomer_to: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD')
    .nullable()
    .test(
      'is-valid-date',
      'Invalid date',
      value => !value || !isNaN(Date.parse(value)),
    )
    .when('merchant_id', {
      is: FBS_MERCHANT_ID,
      then: schema => schema.required('Povinné pole'),
    }),
  validity_voucher_from: Yup.string()
    .required('Povinné pole')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD')
    .test(
      'is-valid-date',
      'Invalid date',
      value => !value || !isNaN(Date.parse(value)),
    ),
  validity_voucher_to: Yup.string()
    .required('Povinné pole')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD')
    .test(
      'is-valid-date',
      'Invalid date',
      value => !value || !isNaN(Date.parse(value)),
    ),
  length: Yup.number()
    .required('Povinné pole')
    .moreThan(0, 'Délka lekce musí být větší než 0'),
  // description: Yup.string().nullable().trim().min(5, 'Příliš krátké!'),
  merchant_id: Yup.number()
    .required('Povinné pole')
    .integer('Číslo merchanta musí být celé číslo')
    .positive('Číslo merchanta musí větší než nula'),
})
