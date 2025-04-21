import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Notification from '@/component/Notification';

import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Notification from '@/component/Notification';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Spark!Bytes</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/images/tabSpark.png" />
      </head>
      <body>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Notification />
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
      </body>
    </html>
  );
}