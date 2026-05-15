import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pesquisa · Hábitos de uso de veículos no RS',
  description:
    'Estudo sobre como moradores do interior do Rio Grande do Sul buscam e utilizam veículos no dia a dia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Inter+Tight:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen relative overflow-x-hidden">{children}</body>
    </html>
  );
}
