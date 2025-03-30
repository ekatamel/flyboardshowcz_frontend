import clock from 'assets/images/clock.png'
import foot from 'assets/images/foot.png'
import { HappyFace } from 'assets/images/HappyFace'
import location from 'assets/images/location.png'
import { Ticket } from 'assets/images/Ticket'
import { Layout } from 'components/shared/Layout'
import { useNavigate } from 'react-router-dom'

import { Tile } from '../shared/Tile'

export const Intro = () => {
  const navigate = useNavigate()

  return (
    <Layout
      stepName='úvod'
      title='Máte voucher s Flyboardshow?'
      noNavigation={true}
      noProgress={true}
    >
      <p className='mb-10 mt-20 text-center text-14 font-bold text-white xl:text-16'>
        Lekce na Flyboardu s profesionálními letci
      </p>
      <div className='mx-auto mt-20 w-fit'>
        <p className='flex items-center gap-10 pb-8 text-14 text-white xl:text-16'>
          <img src={clock} alt='Clock icon' className='w-24 xl:w-30' />
          <span>Každý se naučí létat do 5 minut</span>
        </p>
        <p className='flex items-center gap-10 pb-8 text-14 text-white xl:text-16'>
          <img src={location} alt='Location icon' className='w-24 xl:w-30' />
          <span>Lokality po celé České Republice (10)</span>
        </p>
        <p className='flex items-center gap-10 pb-8 text-14 text-white xl:text-16'>
          <img src={foot} alt='Foot icon' className='w-24 xl:w-30' />
          <span>Omezení - velikost nohy min. EU 35</span>
        </p>
      </div>

      <div className='mb-20 mt-20 flex grow flex-col items-center justify-center gap-28 md:flex-row xl:mt-60'>
        <Tile
          title='Mám voucher'
          icon={Ticket}
          onClick={() => navigate('/rezervace')}
        />
        <Tile
          title='Nemám, ale chci!'
          icon={HappyFace}
          onClick={() => navigate('/nakup-voucheru')}
        />
      </div>
    </Layout>
  )
}
