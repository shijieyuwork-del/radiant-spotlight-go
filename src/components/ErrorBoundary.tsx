import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

const RELOAD_FLAG = "ca.errorBoundary.reloaded";

/**
 * 全局错误边界：
 * - 任何子树渲染错误（例如某个组件未定义/导入失败）都会落到友好兜底页，而不是白屏。
 * - 开发模式下，HMR 偶发会留下“模块已更新但引用还是旧导出”的陈旧状态
 *   （典型表现：`ReferenceError: Xxx is not defined`）。此类错误自动强制整页刷新一次，
 *   用最新模块重建运行时；用 sessionStorage 防止刷新死循环。
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);

    const isStaleHmr =
      import.meta.env.DEV &&
      error instanceof ReferenceError &&
      /is not defined/.test(error.message);

    if (isStaleHmr && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
    }
  }

  componentDidMount() {
    // 页面成功渲染后清除刷新标记，允许下次真正的错误再次自动刷新
    sessionStorage.removeItem(RELOAD_FLAG);
  }

  private handleReload = () => window.location.reload();

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen grid place-items-center bg-background px-6">
        <div className="max-w-md w-full text-center glow-card rounded-3xl p-10 bg-card">
          <div className="size-14 mx-auto rounded-2xl bg-destructive/10 grid place-items-center">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <h1 className="font-display text-2xl font-semibold mt-5">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            页面渲染时遇到问题。请刷新重试；若仍无法恢复，请返回首页。
          </p>
          {import.meta.env.DEV && (
            <pre className="mt-4 text-left text-xs bg-muted rounded-xl p-3 overflow-auto max-h-32">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3 justify-center mt-6">
            <Button onClick={this.handleReload} className="rounded-full">
              <RefreshCcw className="size-4 mr-1.5" /> Reload
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a href="/">
                <Home className="size-4 mr-1.5" /> Home
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
