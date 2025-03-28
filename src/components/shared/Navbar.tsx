import { navlinks } from '@/constants';
import { useStateContext } from '@/context';
import { usePrivy } from '@privy-io/react-auth';
import { IconHeartHandshake } from '@tabler/icons-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';

interface NavLink {
  name: string;
  link: string;
  imgUrl: string;
}

interface User {
  createdBy: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<string>('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState<boolean>(false);
  const { authenticated, login, user, logout } = usePrivy();
  const { fetchUsers, users, fetchUserRecords } = useStateContext();

  const fetchUserInfo = useCallback(async () => {
    if (!user) return;

    try {
      await fetchUsers();
      const existingUser = users.find(
        (u: User) => u.createdBy === user?.email?.address
      );
      if (existingUser) {
        await fetchUserRecords(user?.email?.address as string);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, [user, fetchUsers, users, fetchUserRecords]);

  useEffect(() => {
    if (authenticated && user) {
      fetchUserInfo();
    }
  }, [authenticated, user, fetchUserInfo]);

  const handleLoginLogout = useCallback(async () => {
    if (authenticated) {
      logout();
    } else {
      try {
        await login();
        if (user) {
          await fetchUserInfo();
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  }, [authenticated, login, logout, user, fetchUserInfo]);

  return (
    <div className='mb-[35px] flex flex-col-reverse justify-between gap-6 md:flex-row'>
      <div className='flex h-[52px] max-w-[458px] flex-row rounded-[100px] bg-[#1c1c24] py-2 pl-4 pr-2 lg:flex-1'>
        <input
          type='text'
          placeholder='Search for records'
          className='flex w-full bg-transparent font-epilogue text-[14px] font-normal text-white outline-none placeholder:text-[#4b5264]'
        />
        <div className='flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-[#4acd8d]'>
          <img
            src={'/icons/search.svg'}
            alt='search'
            className='h-[15px] w-[15px] object-contain'
          />
        </div>
      </div>

      <div className='hidden flex-row justify-end gap-2 sm:flex'>
        <CustomButton
          btnType='button'
          title={authenticated ? 'Log Out' : 'Log In'}
          styles={authenticated ? 'bg-[#1dc071]' : 'bg-[#1ec070]'}
          handleClick={handleLoginLogout}
        />
      </div>

      <div className='relative flex items-center justify-between sm:hidden'>
        <div className='flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[10px] bg-[#2c2f32]'>
          <IconHeartHandshake size={40} color='#1ec070' className='p-2' />
        </div>
        <img
          src={'/icons/menu.svg'}
          alt='menu'
          className='h-[34px] w-[34px] cursor-pointer object-contain'
          onClick={() => setToggleDrawer((prev) => !prev)}
        />
        <div
          className={`absolute left-0 right-0 top-[60px] z-10 bg-[#1c1c24] py-4 shadow-secondary ${
            !toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'
          } transition-all duration-700`}
        >
          <ul className='mb-4'>
            {navlinks.map((link: NavLink) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && 'bg-[#3a3a43]'
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`h-[24px] w-[24px] object-contain ${
                    isActive === link.name ? 'grayscale-0' : 'grayscale'
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue text-[14px] font-semibold ${
                    isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
          <div className='mx-4 flex'></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
