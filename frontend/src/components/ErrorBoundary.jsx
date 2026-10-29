import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="research-card"
          style={{
            maxWidth: '680px',
            margin: '40px auto',
            padding: '32px',
            border: '2px solid var(--c-rosy-brown)',
            background: '#ffffff',
            boxShadow: 'var(--shadow-card)',
          }}
          id="error-boundary-fallback"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--c-rosy-brown-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a150e',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--c-dark-green)', margin: 0 }}>
                Something unexpected occurred
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                We encountered an issue displaying this section. Your session data is preserved.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'var(--c-beige-tint)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--c-midnight-green)',
              marginBottom: '20px',
              wordBreak: 'break-word',
            }}
          >
            {this.state.error?.message || 'Unknown application error'}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-academic-primary"
              onClick={this.handleReset}
              id="error-boundary-retry-btn"
            >
              <RefreshCw size={14} />
              <span>Try Again</span>
            </button>
            <button
              className="btn-academic-secondary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              id="error-boundary-reload-btn"
            >
              <Home size={14} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
