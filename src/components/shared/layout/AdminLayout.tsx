import { Menu } from './Menu'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className='bg-black w-screen min-h-screen lg:flex'>
      <Menu />
      <div className='py-20 lg:py-40 px-28 w-full grow'>{children}</div>
    </div>
  )
}
