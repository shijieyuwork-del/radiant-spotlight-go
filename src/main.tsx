import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./city-index-cta.css";
import { bootstrapAnalytics } from "@/lib/analytics";

bootstrapAnalytics();
createRoot(document.getElementById("root")!).render(<App />);
