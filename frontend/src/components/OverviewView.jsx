import React from 'react';
import {
  ArrowRight,
  Cpu,
} from 'lucide-react';

export default function OverviewView({ onNavigate }) {
  return (
    <div className="tab-panel" id="overview-section">
      {/* Purpose Banner */}
      <div className="academic-notice-box">
        <strong>System Overview & Academic Purpose</strong>
        This system is an educational First-Order Logic (FOL) reasoning engine developed to model legal entitlement
        and complaint maintainability under the <strong>Indian Consumer Protection Act, 2019 (CPA 2019)</strong>.
        Rather than relying on statistical heuristics or opaque neural models, it performs rigorous symbolic
        deduction using Robinson's Unification Algorithm and Horn Clause forward-chaining inference.
      </div>

      {/* Core Architectural Pillars */}
      <div className="research-card">
        <div className="research-card-header">
          <h3 className="research-card-title">
            <Cpu size={18} style={{ color: 'var(--c-midnight-green)' }} />
            How First-Order Logic Reasons Over Legal Rules
          </h3>
          <span className="statutory-badge">AIMA Chapter 8 & 9</span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '16px' }}>
          Consumer law inherently involves parametric relationships between buyers, sellers, goods, and judicial
          commissions. First-Order Logic enables general statutory clauses to be evaluated across any citizen:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              background: 'var(--c-beige-tint)',
              border: '1px solid var(--border-subtle)',
              borderLeft: '3px solid var(--c-moss-green)',
              padding: '12px 14px',
              borderRadius: '0 4px 4px 0',
            }}
          >
            <strong style={{ fontSize: '0.88rem', color: 'var(--c-dark-green)', display: 'block' }}>
              1. Term Unification (Robinson's MGU)
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Variables (e.g. <code className="code-pill-academic">?Consumer</code>, <code className="code-pill-academic">?Goods</code>)
              are bound to concrete domain constants (e.g. <code className="code-pill-academic">Ramesh</code>, <code className="code-pill-academic">Smartphone_Model_Z</code>)
              via Robinson's unification algorithm with occurs-check.
            </p>
          </div>

          <div
            style={{
              background: 'var(--c-beige-tint)',
              border: '1px solid var(--border-subtle)',
              borderLeft: '3px solid var(--c-midnight-green)',
              padding: '12px 14px',
              borderRadius: '0 4px 4px 0',
            }}
          >
            <strong style={{ fontSize: '0.88rem', color: 'var(--c-dark-green)', display: 'block' }}>
              2. Horn Clause Deduction
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Legal statutes are encoded as definite Horn rules:
              <br />
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--c-midnight-green)' }}>
                is_consumer(?c, ?g) :- purchased(?c, ?g, ?s), paid_consideration(?c, ?g).
              </code>
            </p>
          </div>

          <div
            style={{
              background: 'var(--c-beige-tint)',
              border: '1px solid var(--border-subtle)',
              borderLeft: '3px solid var(--c-rosy-brown)',
              padding: '12px 14px',
              borderRadius: '0 4px 4px 0',
            }}
          >
            <strong style={{ fontSize: '0.88rem', color: 'var(--c-dark-green)', display: 'block' }}>
              3. Transparent Derivation Proofs
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Every query result is verifiable. The engine traces backwards from derived conclusions through
              applied rules down to asserted ground facts, eliminating black-box hallucinations.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Legal Distinction Section */}
      <div className="allegation-caution-box">
        <strong>The Essential Statutory Principle of the CPA, 2019</strong>
        <p style={{ marginBottom: '8px' }}>
          Under Indian consumer jurisprudence, there is a strict separation between <em>unilateral claims</em> and
          <em>adjudicated facts</em>:
        </p>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>
            <strong>Allegation (Section 35):</strong> A consumer alleging a defect has standing to initiate inquiry
            (<code className="code-pill-academic">maintainable_complaint</code>), but this allegation alone does NOT establish liability.
          </li>
          <li>
            <strong>Procedural Adjudication (Section 38):</strong> If denied by the seller, the Commission orders statutory
            laboratory analysis (<code className="code-pill-academic">lab_analysis_ordered</code>).
          </li>
          <li>
            <strong>Relief Adjudication (Section 39):</strong> Remedies (refund, replacement, compensation) are granted
            ONLY upon formal judicial findings of defect (<code className="code-pill-academic">commission_finding_defect</code>).
            A consumer <em>never</em> automatically qualifies for a refund simply by alleging an issue.
          </li>
        </ul>
      </div>

      {/* Quick Navigation Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <div className="research-card" style={{ marginBottom: 0 }}>
          <h4 style={{ color: 'var(--c-dark-green)', marginBottom: '8px' }}>Explore 4 Statutory Cases</h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Inspect real cases demonstrating allegations vs. findings (Ramesh & Priya), commercial exclusions
            (Apex Logistics), and dismissed consumer mishandling claims (Vikram).
          </p>
          <button
            className="btn-academic-primary"
            onClick={() => onNavigate('cases')}
            id="overview-cases-btn"
          >
            <span>Open Consumer Cases</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="research-card" style={{ marginBottom: 0 }}>
          <h4 style={{ color: 'var(--c-dark-green)', marginBottom: '8px' }}>Interactive FOL Workbench</h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Query goals against the live Flask API server, inspect variable unifications, and trace complete
            derivation proof sequences.
          </p>
          <button
            className="btn-academic-midnight"
            onClick={() => onNavigate('workbench')}
            id="overview-workbench-btn"
          >
            <span>Launch Query Workbench</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
