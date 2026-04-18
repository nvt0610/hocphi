import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  showPasswordToggle?: boolean;
  noMargin?: boolean;
  onClear?: () => void;
}

const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  placeholder, 
  showPasswordToggle, 
  noMargin,
  onClear,
  className = '', 
  value,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const finalType = isPassword && showPasswordToggle && showPassword ? 'text' : type;
  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <div className="relative w-full">
      <input
        type={finalType}
        value={value}
        placeholder={placeholder}
        className={`w-full py-5 px-6 rounded-2xl outline-none text-[15px] text-center font-bold bg-app-input/50 focus:bg-app-surface transition-all border border-transparent focus:border-app-border text-app-fg placeholder:text-stone-400 placeholder:font-medium ${
          (isPassword && showPasswordToggle) || onClear ? 'pr-14' : ''
        } ${className}`}
        {...props}
      />
      {isPassword && showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-fg transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
      {!isPassword && onClear && hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-all flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      )}
    </div>
  );
};

export default Input;
