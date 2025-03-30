import logo from 'assets/images/logo-new.png'
import clsx from 'clsx'
import { InputError } from 'components/shared/InputError'
import { useAuth } from 'context/AuthContext'
import { Field, Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { loginValidationSchema } from 'utils/validation-schemas'

export const Login = () => {
  const navigate = useNavigate()
  const { login, currentUser } = useAuth()
  const { mutate: signIn } = useMutation(login)

  useEffect(() => {
    if (currentUser && currentUser.access_token) {
      navigate('/admin')
    }
  }, [currentUser, navigate])

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
        Přihlášení
      </h1>
      <Formik
        initialValues={{
          username: '',
          password: '',
          admin: false,
        }}
        onSubmit={() => {}}
        validationSchema={loginValidationSchema}
      >
        {({ values, errors, touched, resetForm }) => {
          const isLoginDisabled =
            !values.username ||
            !values.password ||
            Object.keys(errors).length > 0
          return (
            <Form>
              <label className='font-title text-textGray lg:text-white w-150 my-auto text-14 lg:text-16'>
                Uživatelské jméno
              </label>
              <Field
                className='w-200 lg:w-300 h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                type='text'
                placeholder='petr_civin'
                name='username'
              />
              {errors.username && touched.username && (
                <InputError errorText={errors.username || ''} />
              )}
              <label className='font-title text-textGray lg:text-white w-150 my-auto text-14 lg:text-16 block mt-30'>
                Heslo
              </label>
              <Field
                className='w-200 lg:w-300 h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                type='password'
                name='password'
              />
              {errors.username && touched.username && (
                <InputError errorText={errors.username || ''} />
              )}
              <a
                href='/registrace'
                className='mt-10 block underline text-mediumGray font-title'
              >
                Registrace
              </a>
              <button
                type='submit'
                className={clsx(
                  'w-100 h-44  font-title text-16 text-black rounded mt-30 block mx-auto',
                  isLoginDisabled ? 'bg-gray' : 'bg-yellow',
                )}
                disabled={isLoginDisabled}
                onClick={() => {
                  signIn(values)
                  resetForm()
                }}
              >
                Přihlásit
              </button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
