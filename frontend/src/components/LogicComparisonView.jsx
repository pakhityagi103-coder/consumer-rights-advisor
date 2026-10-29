import React, { useEffect, useState, useCallback } from 'react';
import { GitCompare, RefreshCw } from 'lucide-react';
import { getLogicComparison } from '../services/api';

export default function LogicComparisonView() {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComparison = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getLogicComparison();
    setLoading(false);
    if (res.success && res.data) {
      setComparisonData(res.data);
    } else {
      setError(res.error || 'Failed to fetch comparison from backend.');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getLogicComparison().then((res) => {
      if (!isMounted) return;
      setLoading(false);
      if (res.success && res.data) {
        setComparisonData(res.data);
      } else {
        setError(res.error || 'Failed to fetch comparison from backend.');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="tab-panel" id="logic-comparison-section">
      <div className="academic-notice-box">
        <strong>Formal Logic Paradigm Analysis: Propositional vs. First-Order Logic</strong>
        This comparative section illustrates why Propositional Logic is mathematically inadequate for legal
        knowledge systems, and why First-Order Predicate Logic is essential to express general statutory rights.
      </div>

      <div className="research-card">
        <div className="research-card-header">
          <h3 className="research-card-title">
            <GitCompare size={18} style={{ color: 'var(--c-midnight-green)' }} />
            Live Endpoint Response: <code style={{ fontSize: '0.85rem' }}>GET /api/logic-comparison</code>
          </h3>
          <button
            className="btn-academic-secondary"
            onClick={fetchComparison}
            disabled={loading}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            id="btn-reload-logic-comp"
          >
            <RefreshCw size={12} className={loading ? 'spin-animation' : ''} />
            <span>Reload Endpoint</span>
          </button>
        </div>

        {loading && (
          <div className="academic-notice-box" style={{ background: 'var(--c-beige-tint)' }}>
            Querying Flask API endpoint <code className="code-pill-academic">/api/logic-comparison</code>...
          </div>
        )}

        {error && (
          <div
            style={{
              background: 'var(--c-rosy-brown-light)',
              border: '1px solid var(--c-rosy-brown)',
              color: '#3b1812',
              padding: '12px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.85rem',
            }}
          >
            <strong>Backend Connection Notice:</strong> {error}
          </div>
        )}

        {comparisonData && (
          <div className="logic-comp-grid">
            {/* Propositional Logic Column */}
            <div className="comp-column-card prop-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: '#4a150e' }}>
                  0-Order: Propositional Logic
                </strong>
                <span className="academic-badge badge-rosy">Atomic</span>
              </div>

              <div className="comp-syntax-box" style={{ color: '#4a150e' }}>
                {comparisonData.propositional_logic?.representation || 'ReportsDefect_Ramesh_Smartphone'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                <div>
                  <strong style={{ color: 'var(--c-dark-green)', display: 'block' }}>Semantic Interpretation:</strong>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {comparisonData.propositional_logic?.meaning ||
                      'A single atomic statement treated as true or false.'}
                  </p>
                </div>

                <div>
                  <strong style={{ color: '#882216', display: 'block' }}>Architectural Limitation:</strong>
                  <p style={{ color: 'var(--text-main)' }}>
                    {comparisonData.propositional_logic?.limitation ||
                      'The statement does not explicitly represent the consumer and product as separate arguments.'}
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--c-beige-tint)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <strong>Result:</strong> Cannot quantify or generalize. Every single combination of consumer and
                  product requires an entirely separate, non-reusable proposition variable.
                </div>
              </div>
            </div>

            {/* First-Order Logic Column */}
            <div className="comp-column-card fol-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--c-midnight-green)' }}>
                  1st-Order: First-Order Predicate Logic
                </strong>
                <span className="academic-badge badge-moss">Parametric</span>
              </div>

              <div className="comp-syntax-box">
                {comparisonData.first_order_logic?.representation || 'ReportsDefect(Ramesh, Smartphone_Model_Z)'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                <div>
                  <strong style={{ color: 'var(--c-dark-green)', display: 'block' }}>Semantic Interpretation:</strong>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {comparisonData.first_order_logic?.meaning ||
                      'A predicate represents a relationship between a consumer and a product.'}
                  </p>
                </div>

                <div>
                  <strong style={{ color: 'var(--c-moss-green)', display: 'block' }}>Core Computational Advantage:</strong>
                  <p style={{ color: 'var(--text-main)' }}>
                    {comparisonData.first_order_logic?.advantage ||
                      'Variables and quantified rules can express general relationships across different consumers and products.'}
                  </p>
                </div>

                <div
                  style={{
                    background: '#eef4e8',
                    border: '1px solid rgba(131, 153, 88, 0.3)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.78rem',
                    color: 'var(--c-dark-green)',
                  }}
                >
                  <strong>Result:</strong> A single Horn rule <code className="code-pill-academic">is_consumer(?c, ?g)</code> applies
                  uniformly across all 1.4 billion citizens without changing the underlying logical theory.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Structured Comparison Matrix Table */}
      <div className="research-card">
        <h4 style={{ color: 'var(--c-dark-green)', marginBottom: '10px' }}>
          Comparative Logical Expressiveness Matrix
        </h4>
        <table className="data-table-academic">
          <thead>
            <tr>
              <th>Feature / Property</th>
              <th>Propositional Logic (0-Order)</th>
              <th>First-Order Predicate Logic (1st-Order)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Ontological Elements</td>
              <td>Facts only (True/False states)</td>
              <td>Objects (Constants), Relations (Predicates), Functions</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Argument Parametrization</td>
              <td>None (atomic symbols)</td>
              <td>N-ary terms (e.g. <code className="code-pill-academic">purchased(c, g, s)</code>)</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Quantification ($\forall, \exists$)</td>
              <td>Not supported</td>
              <td>Universal ($\forall$) & Existential ($\exists$) quantification</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Inference Machinery</td>
              <td>Truth tables, DPLL, SAT solvers</td>
              <td>Robinson Unification, Generalized Modus Ponens, Resolution</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Legal Knowledge Scaling</td>
              <td>Combinatorial explosion (unscalable)</td>
              <td>Compact, general statutory Horn rules</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
