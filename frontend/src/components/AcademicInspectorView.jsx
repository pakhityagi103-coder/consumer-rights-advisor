import React, { useState } from 'react';
import QueryWorkbench from './QueryWorkbench';
import KnowledgeBaseExplorer from './KnowledgeBaseExplorer';
import LogicComparisonView from './LogicComparisonView';
import { Terminal, Database, GitCompare, ArrowLeft, Cpu } from 'lucide-react';

export default function AcademicInspectorView({
  initialQuery,
  onBackToConsumer,
  activeSubSection = 'workbench',
  onChangeSubSection,
}) {
  const [internalSubTab, setInternalSubTab] = useState(activeSubSection);
  const currentTab = onChangeSubSection ? activeSubSection : internalSubTab;

  const handleTabChange = (tab) => {
    if (onChangeSubSection) {
      onChangeSubSection(tab);
    } else {
      setInternalSubTab(tab);
    }
  };

  return (
    <div className="tab-panel" id="academic-inspector-main">
      {/* Inspector Header & Back Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--c-midnight-green)',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={20} style={{ color: 'var(--c-beige)' }} />
          <div>
            <strong style={{ fontSize: '0.98rem' }}>Advanced First-Order Logic Inspector</strong>
            <span style={{ fontSize: '0.76rem', display: 'block', opacity: 0.85 }}>
              Symbolic Inference Engine (Robinson Unification, Horn Clauses, Resolution Refutation)
            </span>
          </div>
        </div>

        <button
          className="btn-academic-secondary"
          onClick={onBackToConsumer}
          id="btn-return-consumer-view"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <ArrowLeft size={13} />
          <span>Return to Consumer Dashboard</span>
        </button>
      </div>

      {/* Evaluator Sub-Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '8px',
          overflowX: 'auto',
        }}
      >
        <button
          className={`chip-btn ${currentTab === 'workbench' ? 'active' : ''}`}
          onClick={() => handleTabChange('workbench')}
          id="inspector-subtab-workbench"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}
        >
          <Terminal size={14} />
          <span>Query Workbench & Resolution</span>
        </button>

        <button
          className={`chip-btn ${currentTab === 'kb' ? 'active' : ''}`}
          onClick={() => handleTabChange('kb')}
          id="inspector-subtab-kb"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}
        >
          <Database size={14} />
          <span>Knowledge Base & Horn Rules</span>
        </button>

        <button
          className={`chip-btn ${currentTab === 'comparison' ? 'active' : ''}`}
          onClick={() => handleTabChange('comparison')}
          id="inspector-subtab-comparison"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}
        >
          <GitCompare size={14} />
          <span>Propositional vs. FOL Comparison</span>
        </button>
      </div>

      {/* Subtab Views */}
      {currentTab === 'workbench' && (
        <QueryWorkbench initialQuery={initialQuery} />
      )}

      {currentTab === 'kb' && (
        <KnowledgeBaseExplorer />
      )}

      {currentTab === 'comparison' && (
        <LogicComparisonView />
      )}
    </div>
  );
}
