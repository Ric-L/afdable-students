import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./react-redux/store.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./react-query/queryClient.ts";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Toaster />
          <App />
        </Router>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
