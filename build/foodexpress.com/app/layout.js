import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// আমরা এই metadata অবজেক্টটি পরিবর্তন করব
export const metadata = {
  title: " Food Express", // এখানে placeholder বসানো হয়েছে
  description: " Delicious meals delivered fast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
