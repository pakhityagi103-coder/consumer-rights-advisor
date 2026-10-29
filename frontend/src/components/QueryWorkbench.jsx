import React, { useState } from 'react';
import {
  Play,
  GitBranch,
  Cpu,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Code,
} from 'lucide-react';
import { queryGoal, explainGoal, proveByResolution } from '../services/api';
import { ACTIVE_FLASK_PRESETS } from '../data/legalDomainData';

export default function QueryWorkbench({ initialQuery }) {
  const [predicate, setPredicate] = useState('ConsumerVerified');
  const [argumentsList, setArgumentsList] = useState(['Ramesh']);
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [explainResult, setExplainResult] = useState(null);
  const [resolutionResult, setResolutionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activePresetLabel, setActivePresetLabel] = useState('ConsumerVerified(Ramesh)');
  const [showRawJson, setShowRawJson] = useState(false);

  const [prevQuery, setPrevQuery] = useState(initialQuery);
  if (initialQuery !== prevQuery) {
    setPrevQuery(initialQuery);
    if (initialQuery?.predicate) {
      setPredicate(initialQuery.predicate);
      setArgumentsList(initialQuery.args || []);
      setActivePresetLabel(null);
      setQueryResult(null);
      setExplainResult(null);
      setResolutionResult(null);
      setErrorMessage(null);
    }
  }

  const handleAddArgument = () => {
    setArgumentsList([...argumentsList, '']);
  };

  const handleRemoveArgument = (index) => {
    if (argumentsList.length > 1) {
      setArgumentsList(argumentsList.filter((_, i) => i !== index));
    }
  };

  const handleArgChange = (index, value) => {
    const updated = [...argumentsList];
    updated[index] = value;
    setArgumentsList(updated);
  };

  const handleSelectPreset = (preset) => {
    setPredicate(preset.predicate);
    setArgumentsList([...preset.args]);
    setActivePresetLabel(preset.label);
    setQueryResult(null);
    setExplainResult(null);
    setResolutionResult(null);
    setErrorMessage(null);
  };

  // Submit Query
  const handleSubmitQuery = async () => {
    if (!predicate.trim()) {
      setErrorMessage('Validation error: Predicate name cannot be empty.');
      return;
    }
    const cleanArgs = argumentsList.map((a) => a.trim()).filter(Boolean);
    if (cleanArgs.length === 0) {
      setErrorMessage('Validation error: Provide at least one non-empty argument constant.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setQueryResult(null);
    setExplainResult(null);
    setResolutionResult(null);

    const res = await queryGoal(predicate, cleanArgs);
    setLoading(false);

    if (res.success) {
      setQueryResult(res.data);
    } else {
      setErrorMessage(res.error || 'Failed to execute query against Flask API.');
    }
  };

  // Request Derivation Explanation
  const handleRequestExplain = async () => {
    if (!predicate.trim()) {
      setErrorMessage('Validation error: Predicate name cannot be empty.');
      return;
    }
    const cleanArgs = argumentsList.map((a) => a.trim()).filter(Boolean);
    if (cleanArgs.length === 0) {
      setErrorMessage('Validation error: Provide at least one non-empty argument constant.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setQueryResult(null);
    setExplainResult(null);
    setResolutionResult(null);

    const res = await explainGoal(predicate, cleanArgs);
    setLoading(false);

    if (res.success) {
      setExplainResult(res.data);
    } else {
      setErrorMessage(res.error || 'Failed to explain goal.');
    }
  };

  // Request Resolution Refutation Proof
  const handleRequestResolution = async () => {
    if (!predicate.trim()) {
      setErrorMessage('Validation error: Predicate name cannot be empty.');
      return;
    }
    const cleanArgs = argumentsList.map((a) => a.trim()).filter(Boolean);
    if (cleanArgs.length === 0) {
      setErrorMessage('Validation error: Provide at least one non-empty argument constant.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setQueryResult(null);
    setExplainResult(null);
    setResolutionResult(null);

    const res = await proveByResolution(predicate, cleanArgs);
    setLoading(false);

    if (res.available && res.data) {
      setResolutionResult(res.data);
    } else {
      setResolutionResult({
        available: false,
        message:
          res.message ||
          res.error ||
          'The endpoint POST /api/resolve is not registered in the active Flask backend.',
      });
    }
  };

  // Formatted predicate string for display
  const currentPredicateDisplay = `${predicate || 'Predicate'}(${argumentsList
    .map((a) => a.trim() || '?term')
    .join(', ')})`;

  return (
    <div className="tab-panel" id="workbench-section">
      <div className="logic-workbench-grid">
        {/* Left Column: Query Form & Presets */}
        <div className="technical-query-card">
          <div className="technical-card-header">
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--c-dark-green)' }}>
                Goal Query Formulation
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Enter or select a First-Order Logic goal to evaluate against the knowledge base.
              </p>
            </div>
            <span className="statutory-badge">FOL Input</span>
          </div>

          {/* Active Flask Presets */}
          <div className="presets-section-wrapper">
            <div className="presets-label">Active Flask KB Presets (Live Server)</div>
            <div className="preset-chip-list">
              {ACTIVE_FLASK_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  id={`preset-${idx}`}
                  className={`chip-btn ${activePresetLabel === p.label ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ marginTop: '12px' }}>
            <div className="form-field-group">
              <label className="form-field-label" htmlFor="predicate-name-input">
                <span>Predicate Symbol</span>
                <span className="note">e.g. ConsumerVerified, is_consumer, ValidPurchase</span>
              </label>
              <input
                id="predicate-name-input"
                className="academic-input"
                type="text"
                value={predicate}
                onChange={(e) => {
                  setPredicate(e.target.value);
                  setActivePresetLabel(null);
                }}
                placeholder="Enter predicate name"
              />
            </div>

            <div className="form-field-group">
              <label className="form-field-label">
                <span>Argument Constants (Terms)</span>
                <span className="note">Ground entity names (e.g. Ramesh, Priya, Smartphone_Model_Z)</span>
              </label>

              {argumentsList.map((arg, idx) => (
                <div key={idx} className="arg-row">
                  <span className="arg-tag">Arg {idx + 1}:</span>
                  <input
                    id={`arg-${idx}-input`}
                    className="academic-input"
                    type="text"
                    value={arg}
                    onChange={(e) => handleArgChange(idx, e.target.value)}
                    placeholder={`Constant argument ${idx + 1}`}
                  />
                  {argumentsList.length > 1 && (
                    <button
                      className="btn-remove-arg"
                      onClick={() => handleRemoveArgument(idx)}
                      title="Remove argument"
                      id={`remove-arg-btn-${idx}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}

              <button
                className="btn-add-arg"
                onClick={handleAddArgument}
                id="btn-add-argument"
                style={{ marginTop: '4px' }}
              >
                <Plus size={13} style={{ display: 'inline', marginRight: 4 }} />
                Add Argument Constant
              </button>
            </div>

            {/* Live Syntax Preview */}
            <div
              style={{
                background: 'var(--c-beige-tint)',
                border: '1px solid var(--border-subtle)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-xs)',
                margin: '14px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Target Formula:
              </span>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--c-midnight-green)', fontWeight: 700 }}>
                {currentPredicateDisplay}
              </code>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  background: 'var(--c-rosy-brown-light)',
                  border: '1px solid var(--c-rosy-brown)',
                  color: '#4a150e',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.82rem',
                  marginBottom: '14px',
                }}
                id="workbench-error-alert"
              >
                <strong>Error:</strong> {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn-academic-primary"
                onClick={handleSubmitQuery}
                disabled={loading}
                id="workbench-query-btn"
              >
                <Play size={14} />
                <span>Submit Query</span>
              </button>

              <button
                className="btn-academic-midnight"
                onClick={handleRequestExplain}
                disabled={loading}
                id="workbench-explain-btn"
              >
                <GitBranch size={14} />
                <span>Explain Proof</span>
              </button>

              <button
                className="btn-academic-secondary"
                onClick={handleRequestResolution}
                disabled={loading}
                id="workbench-resolve-btn"
                title="Attempt Robinson resolution refutation"
              >
                <Cpu size={14} />
                <span>Resolution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reasoning & Explanation Sequence */}
        <div className="reasoning-display-panel">
          <div className="technical-card-header">
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--c-dark-green)' }}>
                Inference Result & Reasoning Sequence
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Symbolic derivation output returned by the Python logic engine.
              </p>
            </div>
            {(queryResult || explainResult || resolutionResult) && (
              <button
                className="btn-academic-secondary"
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                onClick={() => setShowRawJson(!showRawJson)}
                id="btn-toggle-raw-json"
              >
                <Code size={12} /> {showRawJson ? 'Hide JSON' : 'Raw JSON'}
              </button>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="academic-notice-box">
              <span className="status-dot online" style={{ marginRight: 6 }} />
              Evaluating query on Flask server using Robinson Unification...
            </div>
          )}

          {/* Honest Resolution Unavailable Notice */}
          {resolutionResult && resolutionResult.available === false && (
            <div className="honest-unavailable-banner" id="resolution-unavailable-notice">
              <strong>Honest Endpoint Status: Resolution Proof Not Exposed</strong>
              <p>{resolutionResult.message}</p>
              <p style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Academic Note: The logic engine in <code className="code-pill-academic">backend/logic_engine.py</code> contains
                a functioning <code className="code-pill-academic">prove_by_resolution()</code> algorithm. Registering
                a route <code className="code-pill-academic">@app.route("/api/resolve")</code> in Flask will enable
                contradiction proofs directly in this panel.
              </p>
            </div>
          )}

          {/* Distinguished Resolution Refutation Result Display */}
          {resolutionResult && resolutionResult.available !== false && (
            <div
              className={`proof-status-header ${resolutionResult.proved ? 'proved' : 'unproved'}`}
              id="resolution-status-header"
              style={{ alignItems: 'flex-start' }}
            >
              <Cpu
                size={24}
                style={{
                  color: resolutionResult.proved ? 'var(--c-moss-green)' : 'var(--c-rosy-brown)',
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    paddingBottom: '8px',
                    marginBottom: '6px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <strong style={{ fontSize: '0.98rem', color: 'var(--c-dark-green)' }}>
                    {resolutionResult.proved
                      ? 'Proved by Resolution Refutation'
                      : 'Goal Not Proved via Resolution'}
                  </strong>
                  <span
                    className={`academic-badge ${resolutionResult.proved ? 'badge-moss' : 'badge-rosy'}`}
                    style={{ padding: '3px 9px', fontSize: '0.74rem' }}
                  >
                    {resolutionResult.proved
                      ? 'Contradiction Derived (Empty Clause)'
                      : 'No Contradiction Derived'}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.86rem',
                    marginTop: '4px',
                    fontWeight: 600,
                    color: 'var(--c-midnight-green)',
                  }}
                >
                  Goal: {resolutionResult.predicate}({resolutionResult.arguments?.join(', ')})
                </div>

                <div style={{ fontSize: '0.84rem', marginTop: '6px', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {resolutionResult.explanation}
                </div>

                <div
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.035)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--c-dark-green)', marginBottom: '2px' }}>
                    Theoretical Method: Proof by Contradiction (Robinson Resolution)
                  </div>
                  <div>
                    The knowledge base was converted into CNF clauses and combined with the negated goal{' '}
                    <code className="code-pill-academic">
                      ~{resolutionResult.predicate}({resolutionResult.arguments?.join(', ')})
                    </code>
                    .{' '}
                    {resolutionResult.proved
                      ? 'Resolving complementary literals derived an empty clause {}, proving the goal.'
                      : 'Resolvents were exhausted without deriving a contradiction.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !queryResult && !explainResult && !resolutionResult && (
            <div className="academic-notice-box" style={{ background: 'var(--c-beige-tint)' }}>
              <strong>Awaiting Query Execution</strong>
              Choose a preset on the left or enter a predicate with arguments, then click
              <strong> Submit Query</strong> or <strong> Explain Proof</strong>.
            </div>
          )}

          {/* Query Result Status Box */}
          {queryResult && !explainResult && (
            <div
              className={`proof-status-header ${queryResult.proved ? 'proved' : 'unproved'}`}
              id="query-status-header"
            >
              {queryResult.proved ? <CheckCircle size={22} /> : <XCircle size={22} />}
              <div>
                <strong style={{ fontSize: '0.95rem' }}>
                  {queryResult.proved ? 'Goal Fact Proved' : 'Goal Could Not Be Proved'}
                </strong>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', marginTop: '2px' }}>
                  {queryResult.predicate}({queryResult.arguments?.join(', ')})
                </div>
                <div style={{ fontSize: '0.78rem', marginTop: '4px', opacity: 0.9 }}>
                  {queryResult.explanation}
                </div>
              </div>
            </div>
          )}

          {/* Derivation Explanation Sequence (Structured) */}
          {explainResult && (
            <div>
              {/* Header Status */}
              <div
                className={`proof-status-header ${explainResult.proved ? 'proved' : 'unproved'}`}
                id="explain-status-header"
              >
                {explainResult.proved ? <CheckCircle size={22} /> : <XCircle size={22} />}
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>
                    {explainResult.proved ? 'Goal Proved via Derivation' : 'Proof Derivation Failed'}
                  </strong>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', marginTop: '2px' }}>
                    Goal: {explainResult.goal}
                  </div>
                  <div style={{ fontSize: '0.78rem', marginTop: '4px', opacity: 0.9 }}>
                    {explainResult.explanation}
                  </div>
                </div>
              </div>

              {/* Matched Fact & Substitutions */}
              {explainResult.proved && (
                <div style={{ marginBottom: '12px' }}>
                  {explainResult.matched_fact && (
                    <div style={{ fontSize: '0.84rem', marginBottom: '6px' }}>
                      <strong>Matched Fact in Knowledge Base:</strong>{' '}
                      <code className="code-pill-academic" style={{ fontSize: '0.84rem' }}>
                        {explainResult.matched_fact}
                      </code>
                    </div>
                  )}

                  {/* Variable Substitutions Table */}
                  {explainResult.substitution && Object.keys(explainResult.substitution).length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <span className="presets-label">Variable Substitutions (Most General Unifier):</span>
                      <table className="substitution-table-mini">
                        <thead>
                          <tr>
                            <th>Variable</th>
                            <th>Bound Term Constant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(explainResult.substitution).map(([varName, val], idx) => (
                            <tr key={idx}>
                              <td style={{ color: 'var(--c-midnight-green)', fontWeight: 700 }}>
                                {varName}
                              </td>
                              <td style={{ color: 'var(--c-dark-green)' }}>{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Step-by-Step Reasoning Sequence */}
              {explainResult.proved && (
                <div className="reasoning-steps-container">
                  {/* Step 1: Base Facts */}
                  {explainResult.supporting_facts?.length > 0 && (
                    <div className="reasoning-step-box">
                      <div className="step-label">Step 1 — Asserted Base Facts (Ground Premises)</div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        The following verified facts are present in the knowledge base:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {explainResult.supporting_facts.map((f, i) => (
                          <span
                            key={i}
                            className="code-pill-academic"
                            style={{ background: '#ffffff', color: 'var(--c-dark-green)' }}
                          >
                            + {typeof f === 'string' ? f : (f?.fact || f?.name || JSON.stringify(f))}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2+: Applied Horn Rules */}
                  {explainResult.applied_rules?.length > 0 &&
                    explainResult.applied_rules.map((r, i) => {
                      const ruleStr = typeof r === 'string' ? r : r?.rule || '';
                      const commentStr = typeof r === 'object' && r !== null ? r.comment : '';
                      const conditionsArr = typeof r === 'object' && r !== null && Array.isArray(r.conditions) ? r.conditions : [];

                      return (
                        <div key={i} className="reasoning-step-box">
                          <div className="step-label">
                            Step {i + 2} — Deductive Rule Application #{i + 1}
                          </div>
                          <div className="step-rule-code">{ruleStr}</div>
                          {commentStr && <div className="step-rule-comment">"{commentStr}"</div>}

                          {/* Conditions List */}
                          {conditionsArr.length > 0 && (
                            <ul className="step-condition-list">
                              {conditionsArr.map((cond, cIdx) => {
                                const condText = typeof cond === 'string' ? cond : cond?.condition || '';
                                const isSatisfied = typeof cond === 'object' && cond !== null ? Boolean(cond.satisfied) : true;
                                return (
                                  <li
                                    key={cIdx}
                                    className={`condition-item ${
                                      isSatisfied ? 'satisfied' : 'unsatisfied'
                                    }`}
                                  >
                                    <span>Condition: {condText}</span>
                                    <span>{isSatisfied ? '[Satisfied]' : '[Unsatisfied]'}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}

                  {/* Final Conclusion */}
                  <div
                    className="reasoning-step-box"
                    style={{ borderLeftColor: 'var(--c-moss-green)', background: '#eef4e8' }}
                  >
                    <div className="step-label" style={{ color: 'var(--c-dark-green)' }}>
                      Conclusion Proved
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--c-dark-green)', fontWeight: 700 }}>
                      ∴ {explainResult.goal} is logically entailed by the Knowledge Base.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Raw JSON Debug View */}
          {showRawJson && (queryResult || explainResult || resolutionResult) && (
            <div
              style={{
                background: 'var(--c-beige-tint)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '10px',
                marginTop: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              <pre>{JSON.stringify(resolutionResult || explainResult || queryResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
