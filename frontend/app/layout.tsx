import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css';

import { Roboto } from 'next/font/google';

export const metadata = {
  title: 'NYT Games',
  description: 'The New York Times Games',
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
});

const theme = createTheme({
  primaryColor: 'gold',
  primaryShade: 6,
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
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
