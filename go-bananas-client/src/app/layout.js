import "./globals.scss";
import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const Fredoka = localFont({
  src: [
    {
      path: "./fonts/Fredoka-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Fredoka-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata = {
  title: "Explain But Use Bananas",
  description: "App by Lukian and Cameron.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={Fredoka.className}>{children}</body>
    </html>
  );
}
