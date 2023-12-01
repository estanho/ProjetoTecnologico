import './globals.css';
import { Toaster } from 'react-hot-toast';

import { Providers as ProviderNextUI } from './ProviderNextUI';
import SupabaseProvider from './ProviderSupabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'MicroRota',
  description: 'Plataforma para auxílio no transporte de vans e micro-ônibus',
  manifest: '/manifest.json',
  icons: { icon: ['/icons/favicon.ico'], apple: ['/icons/icon.png'] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={'h-full'}>
        <SupabaseProvider>
          <ProviderNextUI>{children}</ProviderNextUI>
          <Toaster position="top-left" reverseOrder={false} />
        </SupabaseProvider>
      </body>
    </html>
  );
}
