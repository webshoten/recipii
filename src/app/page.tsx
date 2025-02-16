'use client';

import Slideshow from '@/components/slideshow/Slideshow';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Suspense>
        <Slideshow />
      </Suspense>
    </>
  );
}
