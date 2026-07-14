"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import WebSocket from "@/components/websocket";
import { store } from "@/store";

import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WebSocket />
      {children}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover
        pauseOnFocusLoss
        draggable
        theme="light"
      />
    </Provider>
  );
}
