import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css';

import { Roboto } from 'next/font/google';
import Session from '@/components/common/SessionWrapper/SessionWrapper';
import Header from '@/components/common/Header/Header';
import { Toaster } from 'react-hot-toast';
import SettingsModal from '@/components/common/SettingsModal/SettingsModal';

export const metadata = {
  title: 'NYT Games',
  description: 'The New York Times Games',
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
});

const theme = createTheme({
  primaryColor: 'orange',
  primaryShade: 5,
  autoContrast: true,
  colors: {
    gold: [
      '#fffce1',
      '#fff8cc',
      '#fff09b',
      '#ffe864',
      '#ffe038',
      '#ffdc1c',
      '#ffda09',
      '#e3c000',
      '#c9ab00',
      '#ae9300',
    ],
    brightBlue: [
      '#e5f4ff',
      '#cde2ff',
      '#9bc2ff',
      '#64a0ff',
      '#3984fe',
      '#1d72fe',
      '#0969ff',
      '#0058e4',
      '#004ecc',
      '#0043b5',
    ],
    emerald: [
      '#ebfff4',
      '#d5fee8',
      '#a5fdce',
      '#73fdb2',
      '#50fd9b',
      '#40fd8c',
      '#37fe84',
      '#2ce271',
      '#1fc863',
      '#00ad52',
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={roboto.className}>
        <Session>
          <MantineProvider theme={theme}>
            <Header />
            <main className="mainContent">{children}</main>
            <Toaster toastOptions={{ className: 'toaster' }} />
            <SettingsModal />
          </MantineProvider>
        </Session>
      </body>
    </html>
  );
}
