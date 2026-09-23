import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Product Admin",
  description: "Manage products from the DummyJSON catalog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-canvas text-ink min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
