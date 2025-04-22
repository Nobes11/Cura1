import React, { ReactNode, Suspense } from 'react';

interface Props {
  children: ReactNode;
}

export const SuspenseWrapper: React.FC<Props> = ({ children }) => {
  return <Suspense fallback={<div className="p-4 flex justify-center items-center min-h-[200px]">Loading...</div>}>{children}</Suspense>;
};
