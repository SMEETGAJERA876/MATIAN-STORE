import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matrin | Clean Home. Better Living.",
  description:
    "Luxury home cleaning products for modern Indian households. Liquid detergent, floor cleaner, dish wash, and toilet cleaner. Lab certified, gentle on hands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-[#FAF7F2] text-slate-800 antialiased selection:bg-[#0A2E4E] selection:text-white">
        <WishlistProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0A2E4E",
                  color: "#FAF7F2",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontFamily: "Inter, sans-serif",
                },
              }}
            />
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}