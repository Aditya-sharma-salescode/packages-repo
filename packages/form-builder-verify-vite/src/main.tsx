import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FormBuilderPlugIn } from "@aditya-sharma-salescode/form-builder";
import { ThemeProvider } from "@aditya-sharma-salescode/shared-ui";
import "@aditya-sharma-salescode/shared-ui/index.css";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/form-workspace/*"
          element={<FormBuilderPlugIn routePrefix="/form-workspace" />}
        />
        <Route path="/" element={<Navigate to="/form-workspace/manage-forms" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" attribute="class" storageKey="fb-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
