'use client';

import { useSearchParams } from 'next/navigation';

export default function Messages() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  return (
    <>
      {error && (
        <p className="m-6 p-4 bg-neutral-100 text-black text-center font-semibold rounded-lg">
          {error}
        </p>
      )}
    </>
  );
}
