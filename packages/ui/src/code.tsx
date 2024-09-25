type CodeProps = {
  children: React.ReactNode;
  className?: string;
};

export const Code = ({ children, className }: CodeProps): JSX.Element => {
  return <code className={className}>{children}</code>;
};
