import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { App } from "./App.jsx";
import { ResetStorage } from "./components/ResetStorage.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary fallback={<ResetStorage />}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
