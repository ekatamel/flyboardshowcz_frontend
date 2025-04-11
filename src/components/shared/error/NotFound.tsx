import { Button } from '../Button'

export const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-black text-white p-4'>
      <div className='max-w-md w-full text-center space-y-8'>
        <h1 className='text-yellow text-9xl font-bold font-title'>404</h1>
        <div>
          <h2 className='text-3xl font-semibold font-title'>
            Stránka nenalezena
          </h2>
          <p className='text-gray-400 font-body py-20'>
            Stránka, kterou hledáte, mohla být odstraněna, její název se mohl
            změnit, nebo je dočasně nedostupná.
          </p>
        </div>

        <hr className='border-t-1 border-gray pb-20' />

        <Button
          title={'Domů'}
          variant='primary'
          className='m-auto mt-20'
          link='/'
        />
      </div>

      {/* Dekorativní prvky */}
      <div className='absolute top-1/4 left-10 w-24 h-24 rounded-full bg-yellow blur-xl' />
      <div className='absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-yellow blur-xl' />

      <div className='absolute bottom-4 text-xs text-gray-600'>
        © {new Date().getFullYear()} FlyboardShow.cz. Všechna práva vyhrazena.
      </div>
    </div>
  )
}
