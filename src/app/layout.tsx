import "./globals.css";
import AppWrapper from "@/components/AppWrapper";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductStoreProvider } from "@/context/ProductStoreContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATRIN | Premium Home Cleaning & Care Solutions",
  description:
    "Luxury home cleaning products for modern Indian households. Premium liquid detergent, floor cleaner, dish wash, and fabric care.",
  icons: {
    icon: "/images/matrin-logo-sticker.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-[#F5FAFF] dark:bg-[#0A1428] text-[#12213F] dark:text-[#F5FAFF] antialiased selection:bg-[#0645B5] selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <ProductStoreProvider>
              <WishlistProvider>
                <CartProvider>
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: "#0645B5",
                        color: "#FFFFFF",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontFamily: "Inter, sans-serif",
                      },
                    }}
                  />
                  <AppWrapper>{children}</AppWrapper>
                </CartProvider>
              </WishlistProvider>
            </ProductStoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}