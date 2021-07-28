import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => (
  <button
    type="button"
    {...props}
    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${className || ""}`}
  >
    {children}
  </button>
)

export const PageButton = ({ children, className, ...props }: ButtonProps) => (
  <button
    type="button"
    {...props}
    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${className || ""}`}
  >
    {children}
  </button>
)
