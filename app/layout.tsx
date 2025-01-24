import '../styles/globals.css';
import { ReactNode } from 'react';
import { I18nProvider } from '../components/I18nProvider';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
