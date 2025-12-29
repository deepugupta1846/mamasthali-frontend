import "./globals.css";
import StoreProvider from './StoreProvider';

export const metadata = {
  title: "Mama's Thali - Fresh Home Cooked Meals",
  description: "Order delicious home-cooked tiffin meals delivered to your doorstep",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
