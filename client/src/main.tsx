import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { registerServiceWorker, setupPWAInstall } from "./lib/pwa";

// Register Service Worker for PWA
registerServiceWorker();

// Setup PWA install prompt
setupPWAInstall();

createRoot(document.getElementById("root")!).render(<App />);
