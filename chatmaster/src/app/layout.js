import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./StoreProvide";
import LearnImg from "@/components/learnImage";
import { px } from "framer-motion";
import Loader from "@/components/loader";
import { store } from "@/lib/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "@/context/ChatProvider";

config.autoAddCss = false;

export const metadata = {
};
export default function RootLayout({ children, chats, login }) {
  return (
    <html lang="en">
      <body>
      <StoreProvider>
      <ChakraProvider>
      <Head>
      <script
        src="https://kit.fontawesome.com/fbadad80a0.js"
        crossOrigin="anonymous"
      ></script>
      </Head>
      <ChatProvider>
      {children}
      </ChatProvider>
      <ToastContainer/>
      </ChakraProvider>
      </StoreProvider>
      </body>
    </html>
  );
}
