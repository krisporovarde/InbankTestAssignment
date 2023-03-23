import "./globals.css";

export const metadata = {
  title: "Inbank Test Assignment",
  description: "Inbank Test Assignment by Kris Porovarde",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
