"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/errorReporter";
import { useTranslations } from "next-intl";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface FallbackProps {
  error: Error | null;
  onReset: () => void;
  onReload: () => void;
}

function LocalizedErrorFallback({ error, onReset, onReload }: FallbackProps) {
  const t = useTranslations("errorBoundary");

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-3xl mb-4">
        😵
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {t("title")}
      </h2>
      <p className="text-sm text-slate-600 mb-6 max-w-md">
        {t("body")}
      </p>
      {process.env.NODE_ENV === "development" && error && (
        <pre className="text-xs text-red-600 bg-red-50 p-4 rounded-lg mb-4 max-w-lg overflow-auto text-left">
          {error.message}
          {"\n"}
          {error.stack}
        </pre>
      )}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset}>
          {t("buttons.retry")}
        </Button>
        <Button onClick={onReload}>
          {t("buttons.reload")}
        </Button>
      </div>
    </div>
  );
}

/**
 * エラーバウンダリコンポーネント
 * 子コンポーネントで発生したエラーをキャッチし、フォールバックUIを表示
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // エラートラッキングフックへ送信
    reportError(error, {
      source: "ErrorBoundary",
      componentStack: errorInfo.componentStack
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <LocalizedErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 関数コンポーネント用のエラーバウンダリラッパー
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";

  const ComponentWithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

