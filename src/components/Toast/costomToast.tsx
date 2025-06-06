// components/GlobalToaster.tsx

"use client";

import { Toaster } from "react-hot-toast";

export default function GlobalToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "0.625rem", 
          background: "oklch(0.91 0.048 83.6)", 
          color: "oklch(0.41 0.077 78.9)", 
          border: "1px solid oklch(0.74 0.063 80.8)", 
        },
        success: {
          style: {
            background: "oklch(0.71 0.097 111.7)", 
            color: "oklch(0.98 0.005 0)", 
          },
          iconTheme: {
            primary: "oklch(0.71 0.097 111.7)",
            secondary: "oklch(0.98 0.005 0)",
          },
        },
        error: {
          style: {
            background: "oklch(0.63 0.24 29.2)", 
            color: "oklch(0.97 0.018 0)", 
            border: "1px solid oklch(0.43 0.24 29.2)", 
          },
          iconTheme: {
            primary: "oklch(0.97 0.018 0)",
            secondary: "oklch(0.63 0.24 29.2)",
          },
        },
      }}
    />
  );
}
