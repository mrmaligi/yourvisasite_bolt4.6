import { Component, type ReactNode } from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

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
        </div>
      );
    }

    return this.props.children;
  }
}
