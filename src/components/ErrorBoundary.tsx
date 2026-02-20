import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children?: ReactNode;
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

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
          <p className="text-neutral-500 max-w-md mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <div className="mt-8 p-4 bg-neutral-50 rounded-lg max-w-2xl w-full text-left overflow-auto">
              <p className="font-mono text-xs text-red-600 mb-2 font-bold">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
