import React, { useEffect, useState, useCallback } from 'react';
import { Scale, RefreshCw, Server } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export default function Header({ onRefreshStatus }) {
  const [healthStatus, setHealthStatus] = useState({
    loading: true,
    online: false,
    message: 'Checking Flask API...',
  });

  const verifyHealth = useCallback(async () => {
    setHealthStatus((prev) => ({ ...prev, loading: true }));
    const res = await checkBackendHealth();
    if (res.success) {
      setHealthStatus({
        loading: false,
        online: true,
        message: res.data?.message || 'API Connected (Flask :5000)',
      });
    } else {
      setHealthStatus({
        loading: false,
        online: false,
        message: res.error || 'Flask API Offline',
      });
    }
    if (onRefreshStatus) onRefreshStatus(res.success);
  }, [onRefreshStatus]);

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((res) => {
      if (!isMounted) return;
      if (res.success) {
        setHealthStatus({
          loading: false,
          online: true,
          message: res.data?.message || 'API Connected (Flask :5000)',
        });
      } else {
        setHealthStatus({
          loading: false,
          online: false,
          message: res.error || 'Flask API Offline',
        });
      }
      if (onRefreshStatus) onRefreshStatus(res.success);
    });
    return () => {
      isMounted = false;
    };
  }, [onRefreshStatus]);

  return (
    <header className="app-header" id="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Scale size={28} />
        </div>
        <div className="brand-title-group">
          <h1>
            Consumer Rights Advisor
            <span className="brand-badge">FOL Reasoning Engine</span>
          </h1>
          <p className="brand-subtitle">
            First-Order Logic Legal Rights & Entitlement Advisory System (Indian CPA 2019)
          </p>
        </div>
      </div>

      <div className="header-status-group">
        <div
          className="status-pill"
          title={healthStatus.message}
          id="backend-status-pill"
        >
          <span
            className={`status-indicator-dot ${
              healthStatus.loading
                ? 'status-loading'
                : healthStatus.online
                ? 'status-online'
                : 'status-offline'
            }`}
          />
          <Server size={14} style={{ color: 'var(--text-muted)' }} />
          <span>
            {healthStatus.loading
              ? 'Connecting...'
              : healthStatus.online
              ? 'Flask API: Online'
              : 'Flask API: Offline'}
          </span>
        </div>

        <button
          className="btn-secondary"
          onClick={verifyHealth}
          disabled={healthStatus.loading}
          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          title="Refresh Backend Health"
          id="refresh-health-btn"
          type="button"
        >
          <RefreshCw
            size={14}
            className={healthStatus.loading ? 'spin-animation' : ''}
          />
        </button>
      </div>
    </header>
  );
}
