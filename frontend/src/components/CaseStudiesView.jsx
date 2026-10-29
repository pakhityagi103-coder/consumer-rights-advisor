import React, { useState } from 'react';
import { ArrowRight, Cpu } from 'lucide-react';
import { CPA_CASE_STUDIES } from '../data/legalDomainData';

export default function CaseStudiesView({ onSelectQueryForWorkbench }) {
  const [selectedCaseId, setSelectedCaseId] = useState(CPA_CASE_STUDIES[0].id);

  const activeCase =
    CPA_CASE_STUDIES.find((c) => c.id === selectedCaseId) || CPA_CASE_STUDIES[0];

  const getTagBadge = (tagColor, tagText) => {
    switch (tagColor) {
      case 'amber':
        return <span className="academic-badge badge-rosy">{tagText}</span>;
      case 'emerald':
        return <span className="academic-badge badge-moss">{tagText}</span>;
      case 'rose':
        return <span className="academic-badge badge-rosy">{tagText}</span>;
      default:
        return <span className="academic-badge badge-neutral">{tagText}</span>;
    }
  };

  return (
    <div className="tab-panel" id="cases-section">
      {/* 4 Case Selector Grid */}
      <div className="cases-selector-grid">
        {CPA_CASE_STUDIES.map((c) => {
          const isSelected = c.id === selectedCaseId;
          return (
            <div
              key={c.id}
              id={`case-card-${c.id}`}
              className={`case-card-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedCaseId(c.id)}
            >
              <div>
                <div className="case-card-header">
                  {getTagBadge(c.tagColor, c.tag)}
                  <span className="statutory-badge">{c.statutoryRef}</span>
                </div>
                <h3 className="case-title-text">{c.title}</h3>
                <div className="case-stage-text">{c.subtitle}</div>
                <p className="case-summary-p">{c.problem}</p>
              </div>

              <div className="case-item-footer">
                <span>
                  Consumer: <strong>{c.consumer.replace(/_/g, ' ')}</strong>
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: isSelected ? 'var(--c-dark-green)' : 'var(--text-muted)',
                    fontWeight: 700,
                  }}
                >
                  {isSelected ? 'Reading Story' : 'Read Story'}
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Case Deep Dive Panel (Story Format) */}
      <div className="research-card" id="case-detail-panel" style={{ padding: '24px 28px' }}>
        <div className="research-card-header" style={{ marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {getTagBadge(activeCase.tagColor, activeCase.tag)}
              <span className="statutory-badge">{activeCase.statutoryRef}</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--c-dark-green)', margin: '4px 0' }}>
              {activeCase.title}
            </h2>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Opposite Party: <strong style={{ color: 'var(--c-dark-green)' }}>{activeCase.seller.replace(/_/g, ' ')}</strong>
          </div>
        </div>

        {/* Story Section 1: Problem */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ color: 'var(--c-dark-green)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: 'var(--c-beige-darker)', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>1</span>
            Problem
          </h4>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-main)', lineHeight: 1.6, background: 'var(--bg-surface-warm)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {activeCase.problem}
          </p>
        </div>

        {/* Story Section 2: What matters */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ color: 'var(--c-dark-green)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: 'var(--c-beige-darker)', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>2</span>
            What matters
          </h4>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, background: '#fdfcf7', padding: '14px 16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--c-moss-green)', borderTop: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            {activeCase.whatMatters}
          </div>
        </div>

        {/* Story Section 3: Possible options */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ color: 'var(--c-dark-green)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: 'var(--c-beige-darker)', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>3</span>
            Possible options
          </h4>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, background: 'var(--bg-surface-warm)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {activeCase.possibleOptions}
          </div>
        </div>

        {/* Story Section 4: Next steps */}
        <div style={{ marginBottom: '26px' }}>
          <h4 style={{ color: 'var(--c-dark-green)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: 'var(--c-beige-darker)', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>4</span>
            Next steps
          </h4>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {activeCase.nextSteps.map((step, idx) => (
              <li key={idx} style={{ paddingLeft: '4px' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Evaluator Shortcut to Academic Tools (Unobtrusive) */}
        {onSelectQueryForWorkbench && (
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Academic Evaluator: Inspect this case's underlying Horn rules in the First-Order Logic Workbench
            </span>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                const primaryQuery = activeCase.testQueries?.[0];
                if (primaryQuery) {
                  onSelectQueryForWorkbench({
                    predicate: primaryQuery.predicate,
                    args: primaryQuery.args,
                    caseTitle: activeCase.title,
                    expected: primaryQuery.expected,
                  });
                }
              }}
            >
              <Cpu size={13} />
              <span>Open Case in Academic Tools</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
