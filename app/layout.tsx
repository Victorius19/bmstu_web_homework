import '@mantine/core/styles.css';
import './globals.css';

import {
    Container,
    ColorSchemeScript,
    MantineProvider,
    Space,
} from '@mantine/core';
import Header from '@/components/Header/Header';
import Providers from './providers';

export const metadata = {
    title: 'HR сервис',
    description: 'Какое-то умное мета-описание',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <Providers>
                    <MantineProvider>
                        <Header />

                        <Space h='xl' />
                        <Space h='xl' />

                        <Container size='md'>{children}</Container>
                    </MantineProvider>
                </Providers>
            </body>
        </html>
    );
}
