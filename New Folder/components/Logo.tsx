
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-[1.5rem]'
  };

  return (
    <div className={`flex items-center justify-center bg-[#0B72E7] shadow-lg shadow-blue-100/50 ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-3/5 h-3/5 text-white"
      >
        <path 
          d="M17 17H19C19.5523 17 20 16.5523 20 16V13L17 11V17ZM17 17V11M17 17H7M17 11L14 8H4V16C4 16.5523 4.44772 17 5 17H7M7 17C7 18.1046 7.89543 19 9 19C10.1046 19 11 18.1046 11 17M7 17C7 15.8954 7.89543 15 9 15C10.1046 15 11 15.8954 11 17M11 17H15M15 17C15 18.1046 15.8954 19 17 19C18.1046 19 19 18.1046 19 17M15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Logo;
