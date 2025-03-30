import logo from 'assets/images/logo-new.png'
import clsx from 'clsx'
import { InputError } from 'components/shared/InputError'
import { useAuth } from 'context/AuthContext'
import { Field, Form, Formik } from 'formik'
import { useMutation } from 'react-query'
import { NewUser } from 'types/types'
import { getReservationFormFields } from 'utils/form-config'
import { registrationValidationSchema } from 'utils/validation-schemas'

export const Registration = () => {
  const reservationFormFields = getReservationFormFields()
  const { signUp } = useAuth()

  const initianValues: NewUser = {
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  }

  const { mutate: register } = useMutation(signUp)

  return (
    <div className='w-screen min-h-screen h-fit bg-black flex flex-col items-center relative pb-40'>
      <a href='https://www.flyboardshow.cz/' target='_blank' rel='noreferrer'>
        <img
          src={logo}
          alt='Flyboard logo'
          className='h-70 lg:h-100 absolute top-10 left-10'
        />
      </a>
      <h1 className='font-title text-heading lg:text-title text-white mb-50 mt-[20vh]'>
        Registrace
      </h1>
      <Formik
        initialValues={initianValues}
        onSubmit={() => {}}
        validationSchema={registrationValidationSchema}
      >
        {({ values, errors, touched, resetForm }) => {
          const isRegistrationDisabled =
            Object.values(values).every(value => value === '') ||
            Object.keys(errors).length > 0

          return (
            <Form>
              <div className='sm:w-1/2 flex flex-wrap flex-col sm:flex-row gap-10 lg:gap-30 xl:gap-10 justify-between sm:mx-auto mb-10 lg:mb-0'>
                {reservationFormFields.map(field => {
                  const { type, required, label, placeholder, included } = field
                  const fieldName = field.name as keyof NewUser
                  if (!included) return null
                  return (
                    <div
                      key={fieldName}
                      className='lg:h-89 h-64 mx-auto sm:mx-0 w-full lg:w-5/12'
                    >
                      <label className='font-title text-textGray lg:text-white w-150 my-auto text-16 whitespace-nowrap'>
                        {label} {required && '*'}
                      </label>
                      <Field
                        type={type}
                        className='w-full h-44 px-10 max-w-169 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                        name={fieldName}
                        placeholder={placeholder}
                      />
                      {errors[fieldName] && touched[fieldName] && (
                        <InputError errorText={errors[fieldName] || ''} />
                      )}
                    </div>
                  )
                })}
              </div>

              <button
                type='submit'
                className={clsx(
                  'w-100 h-44  font-title text-16 text-black rounded mt-30 block mx-auto',
                  isRegistrationDisabled ? 'bg-gray' : 'bg-yellow',
                )}
                disabled={isRegistrationDisabled}
                onClick={() => {
                  register(values)
                  resetForm()
                }}
              >
                Registrovat
              </button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
