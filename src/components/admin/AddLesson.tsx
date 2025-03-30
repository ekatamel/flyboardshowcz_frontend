import { Select } from '@chakra-ui/react'
import clsx from 'clsx'
import { InputError } from 'components/shared/InputError'
import { Field, useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import { AdminOrder, Branch, FormFields, Lesson } from 'types/types'
import { fetchBranches, fetchLessonConfiguration } from 'utils/requests'

interface AddLessonProps {
  lessonFields: FormFields[]
}

export const AddLesson = ({ lessonFields }: AddLessonProps) => {
  const { data: branches } = useQuery<Branch[]>('branches', fetchBranches)
  const { data: lessons } = useQuery<Lesson[]>(
    'lessonConfiguration',
    fetchLessonConfiguration,
  )

  const { setFieldValue, errors, touched } = useFormikContext<AdminOrder>()

  const lessonErrors = errors.lesson as any
  const lessonTouched = touched.lesson as any

  const handleChange = (e: ChangeEvent<HTMLSelectElement>, name: string) => {
    const { value } = e.target
    setFieldValue(name, value)
  }

  const filteredLessons = lessons?.filter(lesson => lesson.discount === 0)

  return (
    <div className='w-1/2'>
      <div className='flex flex-col gap-10 lg:gap-0 justify-between mb-40 lg:mb-0'>
        {lessonFields.map(field => {
          if (!field.included) return null
          return (
            <div key={field.name} className='lg:h-89 h-64 w-10/12'>
              <div className='block w-full'>
                <label
                  className={clsx(
                    'font-title text-textGray w-150 my-auto text-14 lg:text-16',
                    field.label === 'Lekce'
                      ? 'lg:text-yellow'
                      : 'lg:text-white',
                  )}
                >
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' && (
                  <Field
                    defaultValue={''}
                    className='w-full h-44 px-8 max-w-169 border bg-bplack font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                    name={`lesson.${field.name}`}
                    as={Select}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleChange(e, `lesson.${field.name}`)
                    }
                  >
                    <option value='' disabled>
                      {field.placeholder}
                    </option>
                    {field.name === 'branch_id' &&
                      branches?.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    {field.name === 'code' &&
                      filteredLessons?.map(lesson => (
                        <option key={lesson.id} value={lesson.lesson_type_code}>
                          {lesson.lesson_type_name}
                        </option>
                      ))}
                  </Field>
                )}
                {field.type === 'datetime-local' && (
                  <Field
                    className='w-full h-44 px-10 border bg-black font-body focus:outline-none focus:border-yellow text-white block border-white rounded text-16'
                    name={`lesson.${field.name}`}
                    type={'datetime-local'}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
              {lessonErrors?.[field.name] && lessonTouched?.[field.name] && (
                <InputError
                  errorText={(lessonErrors[field.name] as string) || ''}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
