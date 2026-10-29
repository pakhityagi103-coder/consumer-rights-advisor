/**
 * Centralized API client service for communicating with the Flask backend.
 * Uses Vite proxy (/api -> http://127.0.0.1:5000) or direct host fallback.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Helper to perform fetch with JSON error handling and timeout.
 */
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';

    let data = null;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data?.error || data?.message || `HTTP error ${response.status}`,
        data: null,
      };
    }

    return {
      success: true,
      status: response.status,
      data,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      status: 0,
      error: err.message || 'Network connection failed. Ensure Flask server is running on http://127.0.0.1:5000.',
      data: null,
    };
  }
}

/**
 * Check backend root / health status.
 * Target endpoint: GET /
 */
export async function checkBackendHealth() {
  return await fetchJson('/');
}

/**
 * Fetch Propositional Logic vs. First-Order Logic comparison.
 * Target endpoint: GET /api/logic-comparison
 */
export async function getLogicComparison() {
  return await fetchJson('/api/logic-comparison');
}

/**
 * Query a First-Order Logic predicate against knowledge base facts/derivations.
 * Target endpoint: POST /api/query
 * Payload: { predicate: string, arguments: string[] }
 */
export async function queryGoal(predicate, args) {
  return await fetchJson('/api/query', {
    method: 'POST',
    body: JSON.stringify({
      predicate: predicate.trim(),
      arguments: args.map((a) => a.trim()).filter(Boolean),
    }),
  });
}

/**
 * Explain the derivation proof tree for a goal.
 * Target endpoint: POST /api/explain
 * Payload: { predicate: string, arguments: string[] }
 */
export async function explainGoal(predicate, args) {
  return await fetchJson('/api/explain', {
    method: 'POST',
    body: JSON.stringify({
      predicate: predicate.trim(),
      arguments: args.map((a) => a.trim()).filter(Boolean),
    }),
  });
}

/**
 * Attempt to query knowledge base metadata (facts, rules, predicates).
 * Target endpoint: GET /api/kb
 * If backend endpoint is not implemented, returns available: false.
 */
export async function getKnowledgeBase() {
  const result = await fetchJson('/api/kb');
  if (!result.success && (result.status === 404 || result.status === 405)) {
    return {
      available: false,
      message: 'The `/api/kb` endpoint is not yet registered in the active Flask backend.',
      data: null,
    };
  }
  return {
    available: result.success,
    ...result,
  };
}

/**
 * Attempt to fetch preset case studies from backend.
 * Target endpoint: GET /api/cases
 * If backend endpoint is not implemented, returns available: false.
 */
export async function getPresetCases() {
  const result = await fetchJson('/api/cases');
  if (!result.success && (result.status === 404 || result.status === 405)) {
    return {
      available: false,
      message: 'The `/api/cases` endpoint is not yet registered in the active Flask backend.',
      data: null,
    };
  }
  return {
    available: result.success,
    ...result,
  };
}

/**
 * Attempt to run Robinson resolution refutation proof.
 * Target endpoint: POST /api/resolve
 * If backend endpoint is not implemented, returns available: false.
 */
export async function proveByResolution(predicate, args) {
  const result = await fetchJson('/api/resolve', {
    method: 'POST',
    body: JSON.stringify({
      predicate: predicate.trim(),
      arguments: args.map((a) => a.trim()).filter(Boolean),
    }),
  });
  if (!result.success && (result.status === 404 || result.status === 405)) {
    return {
      available: false,
      message: 'Resolution endpoint `/api/resolve` is not yet registered in backend/app.py.',
      data: null,
    };
  }
  return {
    available: result.success,
    ...result,
  };
}

/**
 * Fetch consumer-first advisory evaluation powered by the backend First-Order Logic engine.
 * Target endpoint: POST /api/advisory
 */
export async function getConsumerAdvisory(payload) {
  return await fetchJson('/api/advisory', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
