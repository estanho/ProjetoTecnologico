'use client';

import { useSearchParams } from 'next/navigation';

export default function Messages() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  return (
    <>
      {error && (
        <p className="mt-4 p-4 bg-neutral-300 text-red-950 text-center font-semibold rounded-lg">
          {error}
        </p>
      )}
    </>
  );
}
