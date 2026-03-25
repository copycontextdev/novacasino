import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/lib/query-client";
import { SabiBootstrap } from "@/components/SabiBootstrap";
import { WsDebugPanel } from "@/components/WsDebugPanel";
import { AppShell } from "@/components/AppShell";
import App from "./App";
import { PlayGamePage } from "./pages/PlayGamePage";
import "./index.css";
import TestLink from "./pages/LinkPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SabiBootstrap />
        <WsDebugPanel />
        <Routes>
          <Route path='/test' element={<TestLink />} />
          <Route path="/play/:gameSlug" element={<PlayGamePage />} />
          <Route
            path="/*"
            element={
              <AppShell>
                <App />
              </AppShell>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
