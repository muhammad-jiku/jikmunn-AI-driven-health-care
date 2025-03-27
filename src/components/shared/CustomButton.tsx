import React from 'react';

interface CustomButtonProps {
  btnType?: 'button' | 'submit' | 'reset';
  title: string;
  handleClick?: () => void;
  styles?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  btnType = 'button',
  title,
  handleClick,
  styles = '',
}) => {
  return (
    <button
      type={btnType}
      className={`rounded-[10px] px-4 font-epilogue text-[16px] font-semibold leading-[26px] text-white ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
