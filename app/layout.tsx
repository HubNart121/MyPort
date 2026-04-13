import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'PORT_TRACK — Stock Portfolio Manager',
  description: 'บันทึกและติดตามการลงทุนในหุ้นหลายตัว คำนวณต้นทุนเฉลี่ย ปันผล และกำไรคาดการณ์',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="font-outfit">
        <Providers>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
