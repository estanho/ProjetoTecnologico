import './globals.css';

export const metadata = {
  title: 'MicroRota',
  description: 'Plataforma para auxílio no transporte de vans e micro-ônibus',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="w-full">{children}</body>
    </html>
  );
}
