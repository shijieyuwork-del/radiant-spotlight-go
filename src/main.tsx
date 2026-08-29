import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import "./city-index-cta.css";
import { bootstrapAnalytics } from "@/lib/analytics";

// 开发模式下，HMR 替换模块时若导出结构变化（新增/删除/重命名组件），
// 旧的引用关系会让应用进入陈旧状态 —— 直接整页刷新，拿到一致的模块图。
if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", () => {
    // 交给 Vite 常规 HMR；真正出错时由 ErrorBoundary 捕获并自动刷新。
  });
  window.addEventListener("vite:preloadError", () => {
    window.location.reload();
  });
}

bootstrapAnalytics();
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
