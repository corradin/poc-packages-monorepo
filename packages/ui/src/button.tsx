'use client';

import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  appName?: string;
} & React.ComponentProps<'button'>;

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from ${appName} app!`)}
    >
      {children}
    </button>
  );
};

export default Button;
