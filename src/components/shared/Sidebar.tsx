import { navlinks } from '@/constants';
import { IconHeartHandshake } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define interface for navlink
interface NavLink {
  name: string;
  imgUrl: string;
  link: string;
  disabled?: boolean;
}

// Define props for Icon component
interface IconProps {
  styles?: string;
  name: string;
  imgUrl: string;
  isActive: string;
  disabled?: boolean;
  handleClick: () => void;
}

const Icon: React.FC<IconProps> = ({
  styles,
  name,
  imgUrl,
  isActive,
  disabled,
  handleClick,
}) => (
  <div
    className={`h-[48px] w-[48px] rounded-[10px] ${
      isActive && isActive === name && 'bg-[#2c2f32]'
    } flex items-center justify-center ${
      !disabled && 'cursor-pointer'
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt='fund_logo' className='h-6 w-6' />
    ) : (
      <img
        src={imgUrl}
        alt='fund_logo'
        className={`h-6 w-6 ${isActive !== name && 'grayscale'}`}
      />
    )}
  </div>
);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<string>('dashboard');

  return (
    <div className='sticky top-5 flex h-[93vh] flex-col items-center justify-between'>
      <Link to='/'>
        <div className='rounded-[10px] bg-[#2c2f32] p-2'>
          <IconHeartHandshake size={40} color='#1ec070' className=' ' />
        </div>
      </Link>
      <div className='mt-12 flex w-[76px] flex-1 flex-col items-center justify-between rounded-[20px] bg-[#1c1c24] py-4'>
        <div className='flex flex-col items-center justify-center gap-3'>
          {navlinks.map((link: NavLink) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>
        <Icon
          name='theme'
          imgUrl={'/icons/sun.svg'}
          isActive={isActive}
          handleClick={() => {}}
          styles='bg-[#1c1c24] shadow-secondary'
        />
      </div>
    </div>
  );
};

export default Sidebar;
