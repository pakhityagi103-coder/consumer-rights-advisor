import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ConsumerAdvisoryView from './components/ConsumerAdvisoryView';
import CaseStudiesView from './components/CaseStudiesView';
import AcademicInspectorView from './components/AcademicInspectorView';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Top-level helper resolving workspace headers and statutory tags.
 */
function getSectionTitle(tab) {
  switch (tab) {
    case 'consumer':
      return {
        title: "Let's solve your consumer problem.",
        subtitle: 'Plain-English options and actionable next steps under Indian Consumer Law',
        statutoryTag: 'Consumer Problem Solver',
      };
    case 'cases':
      return {
        title: 'Consumer Stories',
        subtitle: 'Plain-English case walkthroughs: Problem, What matters, Options, and Next steps',
        statutoryTag: 'Real Case Stories',
      };
    case 'inspector':
      return {
        title: 'Academic Tools (Evaluators Area)',
        subtitle: 'Formal First-Order Logic theorem prover, Horn clause derivations, and knowledge base inspector',
        statutoryTag: 'Academic Evaluators Suite',
      };
    default:
      return {
        title: "Let's solve your consumer problem.",
        subtitle: 'Indian Consumer Protection Act, 2019',
        statutoryTag: 'CPA 2019',
      };
  }
}

export default function App() {
  // 1. Main Navigation State (Default to consumer-friendly advisory)
  const [activeTab, setActiveTab] = useState('consumer');

  // 2. Sub-tab state within Academic Inspector ('workbench' | 'kb' | 'comparison')
  const [inspectorSubTab, setInspectorSubTab] = useState('workbench');

  // 3. Goal Query state transferred into the Logic Workbench
  const [workbenchQuery, setWorkbenchQuery] = useState(null);

  // 4. Mobile sidebar toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handler: Open academic inspector from consumer workflow
  const handleOpenInspectorWithQuery = (queryItem) => {
    if (queryItem) {
      setWorkbenchQuery(queryItem);
    }
    setActiveTab('inspector');
    setInspectorSubTab('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Case study transfer into logic engine
  const handleSelectCaseQuery = (queryItem) => {
    setWorkbenchQuery(queryItem);
    setActiveTab('inspector');
    setInspectorSubTab('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Subtab selection from sidebar for academic evaluators
  const handleSelectInspectorSubTab = (subTab) => {
    setActiveTab('inspector');
    setInspectorSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentMeta = getSectionTitle(activeTab);

  return (
    <div className="academic-app-shell" id="app-root">
      {/* Mobile Top Navigation Header */}
      <header className="mobile-header-bar" id="mobile-header-bar">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="mobile-header-brand">
          <span className="mobile-brand-title">Consumer Rights Advisor</span>
          <span className="mobile-brand-subtitle">Indian CPA 2019</span>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectInspectorSubTab={handleSelectInspectorSubTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <main className="main-workspace" id="main-content-region">
        {/* Top Header Bar */}
        <div className="workspace-top-bar">
          <div className="workspace-title-group">
            <h2>{currentMeta.title}</h2>
            <p>{currentMeta.subtitle}</p>
          </div>
          <span className="statutory-badge">{currentMeta.statutoryTag}</span>
        </div>

        {/* View Switcher wrapped in ErrorBoundary */}
        <ErrorBoundary onReset={() => setActiveTab('consumer')}>
          {/* 1. Main Consumer-First Advisory Dashboard */}
          {activeTab === 'consumer' && (
            <ConsumerAdvisoryView
              onOpenInspector={handleOpenInspectorWithQuery}
              onSelectCase={() => setActiveTab('cases')}
            />
          )}

          {/* 2. Statutory Case Studies Section */}
          {activeTab === 'cases' && (
            <CaseStudiesView onSelectQueryForWorkbench={handleSelectCaseQuery} />
          )}

          {/* 3. Academic Evaluator Logic Inspector Suite */}
          {activeTab === 'inspector' && (
            <AcademicInspectorView
              initialQuery={workbenchQuery}
              activeSubSection={inspectorSubTab}
              onChangeSubSection={setInspectorSubTab}
              onBackToConsumer={() => setActiveTab('consumer')}
            />
          )}
        </ErrorBoundary>

        {/* Professional Academic Footer */}
        <footer className="workspace-footer">
          <p>
            <strong>Consumer Rights Advisor</strong> — First-Order Logic Legal Reasoning & Entitlement Advisory System
          </p>
          <p style={{ marginTop: '4px', opacity: 0.85 }}>
            Statutory framework of the Consumer Protection Act, 2019 (India). Robinson Unification & Horn Clause Deduction.
          </p>
        </footer>
      </main>
    </div>
  );
}
