import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import './styles/phone-override.css';
import './styles/bubbles.css'
import './styles/scroll-container.css'
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);
