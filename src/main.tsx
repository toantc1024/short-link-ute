import App from "@/App";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RedirectPage from "./pages/RedirectPage";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} />
      <Route path="/:short_code" element={<RedirectPage />} />
    </Routes>
  </BrowserRouter>
);
