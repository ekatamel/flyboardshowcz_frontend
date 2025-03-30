import { useMediaQuery } from '@chakra-ui/react'
import { Customers } from 'assets/images/Customers'
import { File } from 'assets/images/File'
import { Lesson } from 'assets/images/Lesson'
import logo from 'assets/images/logo-new.svg'
import logoutIcon from 'assets/images/logout.svg'
import { Reservations } from 'assets/images/Reservations'
import { Settings } from 'assets/images/Settings'
import clsx from 'clsx'
import { useAuth } from 'context/AuthContext'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export const Menu = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()

  const [isLgBreakpoint] = useMediaQuery('(min-width: 1024px)')

  const variants = {
    hidden: { width: '75px' },
    visible: { width: '250px' },
  }

  const menuConfig = [
    {
      title: 'Lekce',
      icon: Lesson,
      path: '/admin/lekce',
    },
    {
      title: 'Vouchery',
      icon: File,
      path: '/admin/vouchery',
    },
    {
      title: 'Rezervace',
      icon: Reservations,
      path: '/admin/rezervace',
    },
    {
      title: 'Nastavení',
      icon: Settings,
      path: '/admin/nastaveni',
    },
    {
      title: 'Zákazníci',
      icon: Customers,
      path: '/admin/zakaznici',
    },
  ]

  const MotionOrStaticDiv = isLgBreakpoint ? motion.div : 'div'

  return (
    <MotionOrStaticDiv
      initial='hidden'
      variants={isLgBreakpoint ? variants : {}}
      whileHover='visible'
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      style={{
        overflow: 'hidden',
      }}
      className='bg-black border-b lg:border-b-0 lg:border-r border-white shrink-0 flex flex-row lg:flex-col w-full max-h-50 lg:max-h-full justify-between'
    >
      <a href='https://www.flyboardshow.cz/' target='_blank' rel='noreferrer'>
        <img src={logo} alt='Flyboard logo' className='pl-8 h-60 shrink-0' />
      </a>
      <div className='lg:mt-100 px-16 flex lg:block items-center gap-20 lg:gap-0'>
        {menuConfig.map(menuItem => {
          const { path, icon: Icon, title } = menuItem
          const isSelected = path === location.pathname
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex cursor-pointer h-40 px-8 py-12 items-center',
                isSelected && 'bg-yellow rounded',
              )}
            >
              <Icon
                stroke={isSelected ? '#000000' : '#ffea00'}
                className={'shrink-0 lg:mr-20'}
              />

              <span
                className={clsx(
                  isExpanded ? 'inline' : 'hidden',
                  'font-title  text-20',
                  isSelected ? 'text-black' : 'text-yellow',
                )}
              >
                {title}
              </span>
            </Link>
          )
        })}
      </div>
      <div className='flex flex-col h-full lg:justify-end lg:pb-100 pl-28 mr-16'>
        <button
          className='text-white mt-16'
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          <img src={logoutIcon} alt='Logout icon' />
        </button>
      </div>
    </MotionOrStaticDiv>
  )
}
