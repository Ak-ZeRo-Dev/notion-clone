import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
              {children}
            </main>
          </div>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
