import { Field } from 'formik'

export const AddAdditionalInfo = () => {
  return (
    <div>
      <p className='text-yellow font-title text-16 mb-10 mt-30'>
        Dodatečné informace
      </p>
      <Field
        as='textarea'
        type='text'
        name='info.message'
        className='w-full min-h-100 px-10 max-w-169 border bg-black focus:outline-none focus:border-yellow text-white block border-white rounded text-16 font-title py-6'
      />
    </div>
  )
}
