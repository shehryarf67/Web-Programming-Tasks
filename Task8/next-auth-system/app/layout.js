import "./globals.css";

export const metadata = {
  title: "Next.js Auth System",
  description: "Authentication with Next.js, MongoDB, Mongoose, bcrypt, Server Actions, and cookies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}