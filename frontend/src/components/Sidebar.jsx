import React, { useEffect, useState, useCallback } from 'react';
import {
  BookOpen,
  Terminal,
  Database,
  GitCompare,
  Cpu,
  RefreshCw,
  Home,
  X,
} from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export default function Sidebar({
  activeTab,
  onSelectTab,
  onSelectInspectorSubTab,
  mobileOpen = false,
  onCloseMobile,
}) {
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
        message: res.data?.message || 'Flask API Online (Port 5000)',
      });
    } else {
      setHealthStatus({
        loading: false,
        online: false,
        message: res.error || 'Flask Server Offline',
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((res) => {
      if (!isMounted) return;
      if (res.success) {
        setHealthStatus({
          loading: false,
          online: true,
          message: res.data?.message || 'Flask API Online (Port 5000)',
        });
      } else {
        setHealthStatus({
          loading: false,
          online: false,
          message: res.error || 'Flask Server Offline',
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabClick = (tab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSubTabClick = (subTab) => {
    if (onSelectInspectorSubTab) onSelectInspectorSubTab(subTab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`} id="app-sidebar">
        <div>
          {/* Brand Header */}
          <div className="sidebar-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="sidebar-badge">Indian CPA 2019</span>
              {mobileOpen && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="mobile-close-btn"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <h1 className="sidebar-title">Consumer Rights Advisor</h1>
            <p className="sidebar-subtitle">
              Plain-English legal guidance and solutions for Indian consumers
            </p>
          </div>

          {/* Main Navigation */}
          <nav aria-label="Main Navigation">
            <ul className="sidebar-nav-list">
              {/* 1. Main Problem Solver (Ordinary Consumers) */}
              <li>
                <button
                  id="nav-btn-consumer"
                  className={`nav-item-btn ${activeTab === 'consumer' ? 'active' : ''}`}
                  onClick={() => handleTabClick('consumer')}
                >
                  <span className="nav-item-number">01</span>
                  <Home size={16} />
                  <span>Solve a Problem</span>
                </button>
              </li>

              {/* 2. Real Consumer Stories */}
              <li>
                <button
                  id="nav-btn-cases"
                  className={`nav-item-btn ${activeTab === 'cases' ? 'active' : ''}`}
                  onClick={() => handleTabClick('cases')}
                >
                  <span className="nav-item-number">02</span>
                  <BookOpen size={16} />
                  <span>Consumer Stories</span>
                </button>
              </li>

              {/* Clearly Labelled Separate Section: Academic Tools */}
              <li style={{ margin: '18px 0 8px 0', paddingLeft: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-on-dark-muted)',
                    fontWeight: 700,
                  }}
                >
                  Academic Tools (Evaluators)
                </span>
              </li>

              {/* Academic Tools Entry */}
              <li>
                <button
                  id="nav-btn-inspector"
                  className={`nav-item-btn ${activeTab === 'inspector' ? 'active' : ''}`}
                  onClick={() => handleTabClick('inspector')}
                  style={{
                    borderLeft: activeTab === 'inspector' ? '3px solid var(--c-beige)' : 'none',
                  }}
                >
                  <span className="nav-item-number">03</span>
                  <Cpu size={16} />
                  <span>Academic Tools Suite</span>
                </button>
              </li>

              {/* Inspector Quick Sub-items */}
              {activeTab === 'inspector' && (
                <li style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                  <button
                    className="nav-item-btn"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    onClick={() => handleSubTabClick('workbench')}
                  >
                    <Terminal size={13} />
                    <span>Query Workbench</span>
                  </button>
                  <button
                    className="nav-item-btn"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    onClick={() => handleSubTabClick('kb')}
                  >
                    <Database size={13} />
                    <span>Knowledge Base Explorer</span>
                  </button>
                  <button
                    className="nav-item-btn"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    onClick={() => handleSubTabClick('comparison')}
                  >
                    <GitCompare size={13} />
                    <span>Logic Comparison</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer with Live Connection Status */}
        <div className="sidebar-footer">
          <div className="connection-status-card" id="sidebar-connection-status">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                className={`status-dot ${healthStatus.online ? 'online' : 'offline'}`}
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-on-dark)' }}>
                {healthStatus.loading
                  ? 'Connecting...'
                  : healthStatus.online
                  ? 'Flask API: Online'
                  : 'Flask API: Offline'}
              </span>
            </div>
            <button
              onClick={verifyHealth}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-on-dark-muted)',
                cursor: 'pointer',
                padding: '2px',
              }}
              title="Refresh Flask API health status"
              id="sidebar-refresh-btn"
              type="button"
            >
              <RefreshCw
                size={12}
                className={healthStatus.loading ? 'spin-animation' : ''}
              />
            </button>
          </div>

          <div className="sidebar-academic-tag">
            <p>AIMA First-Order Reasoning Engine</p>
            <p style={{ opacity: 0.8 }}>Robinson Unification & Horn Clauses</p>
          </div>
        </div>
      </aside>
    </>
  );
}
