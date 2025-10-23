import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ปราณีตพันธุ์ไม้ - สมาชิกพิเศษ',
  description: 'ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิก',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
