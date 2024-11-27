"use client";
import { AppProvider } from '@/context/AppContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { NavbarComponent } from '@/components/navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AppProvider>
        <body>
          <div className="page">
            <NavbarComponent />
            <main>{children}</main>
          </div>
        </body>
      </AppProvider>
    </html>
  );
}