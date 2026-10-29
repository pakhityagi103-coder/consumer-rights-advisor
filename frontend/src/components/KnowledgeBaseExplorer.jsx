import React, { useEffect, useState } from 'react';
import { Search, FileCode2, Layers } from 'lucide-react';
import { getKnowledgeBase } from '../services/api';
import { CPA_RULES_REFERENCE } from '../data/legalDomainData';

export default function KnowledgeBaseExplorer() {
  const [kbResponse, setKbResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    async function loadKb() {
      setLoading(true);
      const res = await getKnowledgeBase();
      setLoading(false);
      setKbResponse(res);
    }
    loadKb();
  }, []);

  const filteredRules = CPA_RULES_REFERENCE.filter(
    (r) =>
      r.head.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.statute.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="tab-panel" id="kb-explorer-section">
      {/* Live Flask Endpoint Status */}
      {loading ? (
        <div className="academic-notice-box">
          Querying active Flask server for <code className="code-pill-academic">/api/kb</code>...
        </div>
      ) : kbResponse && !kbResponse.available ? (
        <div className="honest-unavailable-banner" id="kb-unavailable-notice">
          <strong>Honest Endpoint Status: `/api/kb` Not Registered in Active Flask Backend</strong>
          <p>{kbResponse.message}</p>
          <p style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            The current <code className="code-pill-academic">backend/app.py</code> handles{' '}
            <code className="code-pill-academic">/api/query</code>,{' '}
            <code className="code-pill-academic">/api/explain</code>, and{' '}
            <code className="code-pill-academic">/api/logic-comparison</code>. The authoritative First-Order
            Logic domain specifications below are sourced directly from{' '}
            <code className="code-pill-academic">backend/knowledge_base.py</code>.
          </p>
        </div>
      ) : kbResponse?.data ? (
        <div className="research-card">
          <h4>Active Server Knowledge Base</h4>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '8px' }}>
            {JSON.stringify(kbResponse.data, null, 2)}
          </pre>
        </div>
      ) : null}

      {/* 3-Tier Predicate Stratification */}
      <div className="research-card">
        <div className="research-card-header">
          <h3 className="research-card-title">
            <Layers size={18} style={{ color: 'var(--c-midnight-green)' }} />
            Three-Tier Legal Predicate Stratification (CPA 2019)
          </h3>
          <span className="statutory-badge">Ontology Taxonomy</span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          To prevent false positive entitlements, predicates are strictly stratified into three epistemological
          classes:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
          }}
        >
          {/* Tier 1: Transactional */}
          <div
            style={{
              background: 'var(--c-beige-tint)',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid var(--c-midnight-green)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--c-dark-green)' }}>
                1. Transactional & Procedural
              </strong>
              <span className="academic-badge badge-midnight">Tier 1</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Objective facts verified via documentation or statutory lab orders.
            </p>
            <table className="data-table-academic">
              <tbody>
                <tr>
                  <td className="code-predicate-cell">purchased(c, g, s)</td>
                  <td style={{ fontSize: '0.74rem' }}>Goods bought from seller</td>
                </tr>
                <tr>
                  <td className="code-predicate-cell">paid_consideration(c, g)</td>
                  <td style={{ fontSize: '0.74rem' }}>Valid payment made</td>
                </tr>
                <tr>
                  <td className="code-predicate-cell">commercial_purpose(c, g)</td>
                  <td style={{ fontSize: '0.74rem' }}>Commercial resale/fleet use</td>
                </tr>
                <tr>
                  <td className="code-predicate-cell">lab_analysis_ordered(comm, g)</td>
                  <td style={{ fontSize: '0.74rem' }}>Sec 38(2)(c) test order</td>
                </tr>
                <tr>
                  <td className="code-predicate-cell">lab_report_confirms_defect(g, d)</td>
                  <td style={{ fontSize: '0.74rem' }}>Govt lab defect proof</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tier 2: Subjective Allegations */}
          <div
            style={{
              background: 'var(--c-rosy-brown-light)',
              border: '1px solid rgba(211, 150, 140, 0.4)',
              borderTop: '3px solid var(--c-rosy-brown)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.88rem', color: '#3b1812' }}>
                2. Subjective Allegations
              </strong>
              <span className="academic-badge badge-rosy">Tier 2</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#4a150e', marginBottom: '10px' }}>
              Unilateral consumer claims under Section 35. Cannot prove liability alone.
            </p>
            <table className="data-table-academic">
              <tbody>
                <tr>
                  <td className="code-predicate-cell" style={{ color: '#4a150e' }}>
                    alleges_defect(c, g, d)
                  </td>
                  <td style={{ fontSize: '0.74rem' }}>Claimed defect in goods</td>
                </tr>
                <tr>
                  <td className="code-predicate-cell" style={{ color: '#4a150e' }}>
                    opposite_party_denies(s, d)
                  </td>
                  <td style={{ fontSize: '0.74rem' }}>Merchant denies liability</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tier 3: Adjudicated Findings & Relief */}
          <div
            style={{
              background: '#eef4e8',
              border: '1px solid rgba(131, 153, 88, 0.4)',
              borderTop: '3px solid var(--c-moss-green)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--c-dark-green)' }}>
                3. Adjudicated Findings
              </strong>
              <span className="academic-badge badge-moss">Tier 3</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Formal judicial rulings under Section 38 and remedies granted under Section 39.
            </p>
            <table className="data-table-academic">
              <tbody>
                <tr>
                  <td className="code-predicate-cell" style={{ color: 'var(--c-dark-green)' }}>
                    commission_finding_defect(comm, g, d)
                  </td>
                  <td style={{ fontSize: '0.74rem' }}>Defect officially proven</td>
                </tr>
                <tr>
                  <td className="code-predicate-cell" style={{ color: 'var(--c-dark-green)' }}>
                    commission_finding_no_defect(comm, g, r)
                  </td>
                  <td style={{ fontSize: '0.74rem' }}>Claim dismissed / mishandling</td>
                </tr>
                <tr>
                  <td className="code-predicate-cell" style={{ color: 'var(--c-dark-green)' }}>
                    commission_ordered_relief(comm, c, s, r)
                  </td>
                  <td style={{ fontSize: '0.74rem' }}>Judicial remedy order</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Horn Inference Rules Table */}
      <div className="research-card">
        <div className="research-card-header">
          <h3 className="research-card-title">
            <FileCode2 size={18} style={{ color: 'var(--c-dark-green)' }} />
            Statutory Horn Clauses (Deductive Rules)
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="academic-input"
              style={{ width: '200px', padding: '4px 8px', fontSize: '0.78rem' }}
              placeholder="Filter rules..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        <table className="data-table-academic">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>Rule</th>
              <th>Conclusion (Head)</th>
              <th>Premises (Body Conditions)</th>
              <th>Statutory Basis & Commentary</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((rule) => (
              <tr key={rule.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{rule.id}</td>
                <td className="code-predicate-cell">{rule.head}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--c-midnight-green)' }}>
                  {rule.body.join(' ∧ ')}
                </td>
                <td style={{ fontSize: '0.82rem' }}>
                  <span className="statutory-badge" style={{ marginRight: '6px' }}>
                    {rule.statute}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{rule.comment}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
