import './globals.css';

export const metadata = {
  title: 'Toram Online Database & System Hub | อุปกรณ์ บอส สูตรคราฟต์',
  description: 'ระบบฐานข้อมูล Toram Online แยกหน้าบ้าน Next.js และหลังบ้าน Node.js เชื่อมต่อฐานข้อมูล toram พร้อมระบบค้นหา สเตตัส บอส สูตรคราฟต์ และ SQL Console',
  keywords: 'Toram Online, Database, Next.js, Gemini, MySQL, เจมินัสซอร์ด, อุปกรณ์, บอส, สูตรคราฟต์',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
