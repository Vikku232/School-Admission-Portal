import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Shared Button component styling based on Design System rules.
 */
export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "font-poppins font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Define styles for each variant
  const variantClasses = {
    primary: "bg-[#1E3A8A] text-white hover:bg-blue-900",
    secondary: "bg-white text-[#1E3A8A] border border-[#1E3A8A] hover:bg-blue-50",
    danger: "bg-[#E24B4A] text-white hover:bg-red-700",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const sizeClasses = "px-4 py-2.5 text-sm";

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
