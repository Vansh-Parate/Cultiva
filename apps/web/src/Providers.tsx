// app/providers.tsx
import React from 'react';
import {HeroUIProvider} from '@heroui/react';
import {ToastProvider} from "@heroui/toast";


export default function Providers({children}) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  )
}