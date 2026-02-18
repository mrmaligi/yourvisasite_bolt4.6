<<<<<<< HEAD
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
=======
import { Component, type ReactNode } from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
>>>>>>> origin/main

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

<<<<<<< HEAD
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900">
          <Card className="max-w-md w-full p-6 text-center shadow-elevated">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Something went wrong
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
              <Button
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>
          </Card>
=======
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Something went wrong</h1>
              <p className="text-neutral-500 dark:text-neutral-400">
                An unexpected error occurred. Please try reloading the page.
              </p>
              {this.state.error && (
                <div className="mt-4 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-left overflow-auto max-h-40">
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            <Button onClick={this.handleReset} className="w-full sm:w-auto">
              Reload Page
            </Button>
          </div>
>>>>>>> origin/main
        </div>
      );
    }

    return this.props.children;
  }
}
