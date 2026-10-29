# Consumer Rights Advisor

A consumer-first problem-solving web application and First-Order Logic (FOL) reasoning system grounded in the **Consumer Protection Act, 2019 (CPA 2019)** and the **Consumer Protection (E-Commerce) Rules, 2020** of India.

The project pairs a **pure-Python symbolic logic engine** (featuring Robinson's First-Order Unification Algorithm, Horn clause forward deduction, and resolution refutation theorem proving) with a **React 19 + Vite 8** frontend designed for ordinary Indian consumers with no legal or technical background.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Consumer Guidance Features](#consumer-guidance-features)
3. [First-Order Logic Engine](#first-order-logic-engine)
4. [Knowledge Base & Legal Taxonomy](#knowledge-base--legal-taxonomy)
5. [Academic Evaluator Tools](#academic-evaluator-tools)
6. [API Endpoints](#api-endpoints)
7. [Project Structure](#project-structure)
8. [Setup & Running (Windows PowerShell)](#setup--running-windows-powershell)
9. [Testing & Quality Verification](#testing--quality-verification)
10. [Known Limitations](#known-limitations)

---

## Project Overview

The Consumer Rights Advisor assists consumers by translating plain-language grievance descriptions into verified statutory complaint maintainability (standing under Section 35), actionable next steps, relevant evidence checklists, and official dispute resolution channels.

- **Primary User**: Ordinary Indian consumers facing defective products, withheld refunds, delivery failures, or denied warranty claims.
- **Crucial Legal Distinction**: Under CPA 2019, establishing that a complaint is **maintainable** establishes procedural standing to submit a dispute for formal Commission inquiry under Section 35. It does **not** prove merchant liability or guarantee a refund, replacement, or compensation award under Section 39.
- **Backend**: Python 3 + Flask REST API (`backend/app.py`) backed by an in-memory symbolic logic engine (`backend/logic_engine.py`) and CPA 2019 statutory domain knowledge base (`backend/knowledge_base.py`).
- **Frontend**: React 19 SPA built with Vite 8 (`frontend/`), styled using an earth-toned palette: Dark Green (`#0A3323`), Moss Green (`#839958`), Cream/Beige (`#F7F4D5`), Rosy Brown (`#D3968C`), and Midnight Green (`#105666`).
- **Proxy**: Vite development server proxies all `/api/*` network calls directly to the Flask backend running on `http://127.0.0.1:5000`.

---

## Consumer Guidance Features

### 1. Consumer-First Homepage
- **Headline**: *"Let's solve your consumer problem."*
- **Four Core Categories**:
  - **Defective Product**: Hardware faults, battery overheating, manufacturing imperfections, dead-on-arrival appliances (CPA 2019 Section 2(10), Section 35).
  - **Refund Problem**: Withheld, delayed, or refused refunds after product returns, cancellations, or failed service (CPA 2019 Section 2(47), E-Commerce Rules 2020).
  - **Delivery Issue**: Non-delivery, severe transit delays, or wrong/counterfeit goods delivered (CPA 2019 Section 2(11), E-Commerce Rules 2020).
  - **Warranty Denied**: Service center refusal or unsubstantiated allegations of user mishandling/water damage (CPA 2019 Section 2(11), Section 38).
- **"What went wrong?" Prompt Box**: Free-text description input with instant sample scenario presets via the *"Use sample issue"* shortcut.
- **Essential Follow-Up Checkers**:
  - Proof of purchase (tax invoice / cash memo / payment transaction).
  - Written notice to merchant or brand.
  - Personal use vs. commercial fleet/resale purchase (Section 2(7) commercial exclusion check).
  - Written service center job sheet or diagnostic inspection report (for warranty/defect issues).
- **Primary Action**: Single *"Get Help"* submission button with live loading state.

### 2. Structured Results Display
The results are presented in a strict, consumer-first hierarchy:
1. **Your situation**: Concise 1–2 sentence statement that accurately summarizes the dispute and explicitly distinguishes unilateral consumer allegations from legally established judicial findings.
2. **What you may be able to do**: Relevant statutory rights and options under CPA 2019 and E-Commerce Rules 2020 explained in plain English (e.g., right to file an inquiry complaint under Section 35, right to request accredited lab testing under Section 38(2)(c), potential remedies under Section 39, commercial exclusion under Section 2(7)). Explains that maintainability provides the right to be heard in an inquiry, not a guaranteed remedy or automatic payment.
3. **Your next steps**: Concrete, numbered action checklist (evidence preservation, 15-day written notice, NCH conciliation, e-Daakhil filing).
4. **Keep these documents**: Only evidence items relevant to the specific dispute (tax invoice, payment receipt, return pickup slip, courier tracking, unboxing video, service center job sheet).
5. **Need more help?**: Official grievance redressal channels:
   - **National Consumer Helpline (NCH)**: Toll-free `1915` (8 AM – 8 PM) / `consumerhelpline.gov.in`
   - **e-Daakhil Portal**: `edaakhil.nic.in` (National / State / District Consumer Disputes Redressal Commission online filing without needing an advocate)
   - **INGRAM**: Integrated Grievance Redressal Mechanism (`ingram.gov.in`)
- **Unobtrusive Legal Note**: Brief disclaimer stating guidance is educational under CPA 2019 and does not guarantee court awards or constitute legal representation.
- **Academic Verification Drawer**: Expandable inspection panel showing the evaluated First-Order Logic goal predicate, proof status, and direct shortcut to load the query into the Academic Logic Workbench.

### 3. Real Consumer Stories (Rewritten Case Studies)
Case studies are presented as real-world narrative stories rather than raw mathematical functions:
- **Case 1: Ramesh vs. TechMart India** (Overheating Smartphone — Allegation Stage under Section 35: Complaint is maintainable for inquiry, but an allegation does not prove merchant liability; remedies under Section 39 require procedural inquiry or formal laboratory defect findings under Section 38(2)(c)).
- **Case 2: Priya vs. PureWater Solutions** (Contaminated Purifier — Adjudicated Defect Finding: Evidence from an accredited testing lab converts an allegation into an established finding under Section 38, unlocking statutory relief under Section 39).
- **Case 3: Apex Logistics vs. SpeedMotors Ltd** (Commercial Fleet Purchase — Statutory Exclusion under Section 2(7): Purchases for commercial resale or business profit are excluded from consumer court jurisdiction unless exclusively for personal livelihood by self-employment).
- **Case 4: Vikram vs. AutoDrive Dealership** (Engine Knocking Dispute — Technical Inspection Finding: Complaint dismissed because technical inspection under Section 38 proved consumer mishandling and adulterated fuel rather than a manufacturing defect, barring warranty relief).

Each story is broken down into:
- **Problem**: What happened to the consumer in plain language.
- **What matters**: Essential legal and evidentiary realities.
- **Possible options**: Remedies available or decided by the Commission.
- **Next steps**: Practical action checklist.

---

## First-Order Logic Engine

The symbolic engine in `backend/logic_engine.py` is written in pure Python without third-party theorem prover dependencies, following the architecture outlined in Russell & Norvig's *Artificial Intelligence: A Modern Approach (AIMA)* (Chapters 8 & 9):

### Core Components
1. **Terms**:
   - `Variable`: Prefixed with `?` (e.g., `?Consumer`, `?Goods`, `?x`). Supports equality and hashing.
   - `Constant`: Ground entities (e.g., `Ramesh`, `Smartphone_Model_Z`, `TechMart_India`).
2. **Predicates (Atoms)**:
   - Form: `name(arg_1, arg_2, ..., arg_n)`.
   - Methods: `arity`, `is_ground()`, `get_variables()`.
3. **Substitutions & Robinson Unification**:
   - `apply_subst(theta, term)`: Applies variable binding mappings with recursive variable chaining.
   - `unify(x, y, theta)`: Robinson's First-Order Unification Algorithm with occurs-check (`check_occurs`) to prevent cyclic term creation. Computes the Most General Unifier (MGU).
4. **Horn Clause Inference & Derivation**:
   - `Rule`: Head predicate derived from a conjunction of body predicates (`head :- body_1, body_2, ...`).
   - `KnowledgeBase._derive_facts()`: Forward-chaining inference engine computing all reachable ground facts until a fixed-point is reached.
   - `KnowledgeBase.query(goal)`: Queries asserted and derived facts via unification.
   - `KnowledgeBase.explain(goal)`: Generates a complete derivation tree including matched ground facts, MGU substitution bindings, and satisfied rule conditions.
5. **Resolution Refutation Theorem Proving**:
   - `Literal`: Atomic predicate with negation flag (`is_negated`).
   - `Clause`: Disjunction of literals.
   - `rule_to_clause(rule)`: Converts Horn clauses into standard CNF clauses ($H \lor \neg B_1 \lor \neg B_2$).
   - `standardize_clause_apart(clause, prefix)`: Variable renaming ensuring fresh variables per resolution step.
   - `resolve(clause1, clause2)`: Pairwise resolution between complementary literals using Robinson unification.
   - `KnowledgeBase.prove_by_resolution(goal, max_steps)`: Proves ground goals by contradiction: negates the goal, adds it to the clause database, and attempts to derive the empty clause ($\Box$).

---

## Knowledge Base & Legal Taxonomy

The knowledge base in `backend/knowledge_base.py` partitions consumer protection concepts into three stratified predicate tiers:

```
+-------------------------------------------------------------------------+
|                  1. TRANSACTIONAL & PROCEDURAL FACTS                   |
|  purchased(?c, ?g, ?s)                    paid_consideration(?c, ?g)    |
|  commercial_purpose(?c, ?g)               complaint_admitted(?comm, ...) |
|  lab_analysis_ordered(?comm, ?g)          lab_report_confirms_defect(...) |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                2. SUBJECTIVE ALLEGATIONS (Section 35)                   |
|  alleges_defect(?c, ?g, ?defect)          opposite_party_denies(?s, ...) |
|  alleges_refund_denial(?c, ?g, ?issue)    alleges_delivery_failure(...) |
|  alleges_warranty_denial(?c, ?g, ?issue)                                |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|             3. ADJUDICATED COMMISSION FINDINGS (Section 38 & 39)        |
|  commission_finding_defect(?comm, ?g, ?d) commission_ordered_relief(...) |
|  commission_finding_no_defect(?comm, ?g, ?reason)                       |
+-------------------------------------------------------------------------+
```

### Derived Statutory Horn Rules:
- **Rule 1 (Consumer Qualification - Section 2(7))**:
  $$\text{is\_consumer}(?c, ?g) \leftarrow \text{purchased}(?c, ?g, ?s) \land \text{paid\_consideration}(?c, ?g)$$
- **Rule 2 (Defective Product Standing - Section 35)**:
  $$\text{maintainable\_complaint}(?c, ?s, ?g) \leftarrow \text{is\_consumer}(?c, ?g) \land \text{alleges\_defect}(?c, ?g, ?d) \land \text{purchased}(?c, ?g, ?s)$$
- **Rule 3 (Relief Consideration Eligibility - Sections 38 & 39)**:
  $$\text{eligible\_for\_relief\_consideration}(?c, ?g) \leftarrow \text{is\_consumer}(?c, ?g) \land \text{commission\_finding\_defect}(?comm, ?g, ?d)$$
- **Rule 4 (Refund Denial Standing - Section 2(47))**:
  $$\text{maintainable\_complaint}(?c, ?s, ?g) \leftarrow \text{is\_consumer}(?c, ?g) \land \text{alleges\_refund\_denial}(?c, ?g, ?d) \land \text{purchased}(?c, ?g, ?s)$$
- **Rule 5 (Delivery Failure Standing - Section 2(11))**:
  $$\text{maintainable\_complaint}(?c, ?s, ?g) \leftarrow \text{is\_consumer}(?c, ?g) \land \text{alleges\_delivery_failure}(?c, ?g, ?d) \land \text{purchased}(?c, ?g, ?s)$$
- **Rule 6 (Warranty Denial Standing - Sections 2(11) & 38)**:
  $$\text{maintainable\_complaint}(?c, ?s, ?g) \leftarrow \text{is\_consumer}(?c, ?g) \land \text{alleges\_warranty_denial}(?c, ?g, ?d) \land \text{purchased}(?c, ?g, ?s)$$
- **Rule 7 (Commercial Purpose Exclusion - Section 2(7))**:
  $$\text{excluded\_commercial\_purchase}(?c, ?g) \leftarrow \text{purchased}(?c, ?g, ?s) \land \text{commercial\_purpose}(?c, ?g)$$

> **Important Legal Clarification on Maintainability**:
> In Rules 2, 4, 5, and 6, deriving `maintainable_complaint(?c, ?s, ?g)` establishes solely that the complainant has prima facie legal standing to submit a grievance for formal inquiry before the Consumer Commission under Section 35. Maintainability is **not** an adjudication of liability, does **not** assume the truth of allegations, and does **not** guarantee a favorable verdict, refund, or compensation. Statutory relief under Section 39 requires an established finding of defect or deficiency under Section 38 following evidence examination or laboratory analysis.

---

## Academic Evaluator Tools

The evaluator suite is housed under a separate, clearly labelled **Academic Tools Suite** in the navigation:
- **Query Workbench**: Interactive execution interface supporting goal evaluation against the Knowledge Base, MGU variable substitution inspection, rule dependency tree rendering, and Robinson resolution refutation proof generation. Includes pre-configured preset queries.
- **Knowledge Base Explorer**: Live inspector querying `/api/kb` to display asserted ground facts, stratified predicate definitions, and Horn rule comments.
- **Propositional vs. FOL Comparison**: Pedagogical view querying `/api/logic-comparison` illustrating the expressiveness gap between propositional atoms and first-order parametric predicates.

---

## API Endpoints

All endpoints are hosted on the Flask backend (`http://127.0.0.1:5000`):

| Method | Endpoint | Description | Sample Request / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check and server status | `{"message": "Consumer Rights Advisory System API is running"}` |
| `GET` | `/api/logic-comparison` | Pedagogical comparison between Propositional and FOL | Returns `{"propositional_logic": {"representation": "...", "meaning": "...", "limitation": "..."}, "first_order_logic": {"representation": "...", "meaning": "...", "advantage": "..."}}` |
| `GET` | `/api/kb` | Returns facts and rules from active KnowledgeBase | `{"name": "ConsumerProtectionKB", "facts_count": 24, "rules_count": 10, "facts": [...], "rules": [...]}` |
| `GET` | `/api/cases` | Returns benchmark CPA case study datasets | `{"cases": [{"id": "case_ramesh", "title": "...", "problem": "...", "what_matters": "...", "possible_options": "...", "next_steps": [...]}, ...]}` |
| `POST` | `/api/advisory` | Main dynamic problem-solving endpoint | **Input**: `{"category": "defective_product", "description": "Battery overheating during charging", "has_invoice": true, "seller_notified": true, "commercial_purpose": false, "inspection_report": false, "consumer_name": "Ramesh", "goods_name": "Smartphone_Model_Z", "seller_name": "TechMart_India"}`<br>**Output**: `{"category": "defective_product", "situation": "...", "what_you_can_do": [...], "next_steps": [...], "keep_documents": [...], "official_channels": [...], "logic_proof": {"goal": "maintainable_complaint(Ramesh, TechMart_India, Smartphone_Model_Z)", "proved": true, ...}, "limitations": "...", "follow_up_questions": [...]}` |
| `POST` | `/api/query` | Queries facts and derived conclusions via unification | **Input**: `{"predicate": "ValidPurchase", "arguments": ["Ramesh"]}`<br>**Output**: `{"predicate": "ValidPurchase", "arguments": ["Ramesh"], "proved": true, "explanation": "The knowledge base derived or matched this fact."}` |
| `POST` | `/api/explain` | Returns detailed Horn clause derivation proof tree | **Input**: `{"predicate": "NeedsReview", "arguments": ["Ramesh", "Smartphone_Model_Z"]}`<br>**Output**: `{"goal": "NeedsReview(Ramesh, Smartphone_Model_Z)", "proved": true, "matched_fact": "NeedsReview(Ramesh, Smartphone_Model_Z)", "substitution": {}, "supporting_facts": ["ReportsDefect(Ramesh, Smartphone_Model_Z)"], "applied_rules": [{"rule": "NeedsReview(?consumer, ?product) :- ReportsDefect(?consumer, ?product).", "conditions": [...]}], "explanation": "The goal matches a derived conclusion."}` |
| `POST` | `/api/resolve` | Proves ground goal by Robinson resolution by contradiction | **Input**: `{"predicate": "ConsumerVerified", "arguments": ["Ramesh"]}`<br>**Output**: `{"predicate": "ConsumerVerified", "arguments": ["Ramesh"], "proved": true, "method": "resolution_by_contradiction", "explanation": "Contradiction derived: The negated goal produced an empty clause {}."}` |

---

## Project Structure

```
consumer-rights-advisor/
├── backend/
│   ├── __init__.py                 # Backend package marker
│   ├── app.py                      # Flask REST API server and route handlers
│   ├── knowledge_base.py           # CPA 2019 legal rules, predicate taxonomy, and sample cases
│   ├── logic_engine.py             # First-Order Logic engine (unification, forward chaining, resolution)
│   ├── logic_engine_backup.py      # Engine reference backup
│   ├── requirements.txt            # Python dependencies (Flask>=3.1,<4.0; gunicorn>=26.0,<27.0)
│   └── test_logic_engine.py        # Test suite containing 91 unit and integration tests (unittest)
├── frontend/
│   ├── public/                     # Static public assets
│   ├── src/
│   │   ├── assets/                 # Icons and image assets
│   │   ├── components/
│   │   │   ├── AcademicInspectorView.jsx  # Evaluator suite container
│   │   │   ├── CaseStudiesView.jsx        # Plain-English case stories walkthrough
│   │   │   ├── ConsumerAdvisoryView.jsx   # Main consumer problem solver interface
│   │   │   ├── ErrorBoundary.jsx          # React UI error boundary
│   │   │   ├── Header.jsx                 # Legacy standalone header (not mounted in App.jsx)
│   │   │   ├── KnowledgeBaseExplorer.jsx  # Stratified KB viewer
│   │   │   ├── LogicComparisonView.jsx    # Propositional vs FOL comparison viewer
│   │   │   ├── OverviewView.jsx           # Architectural overview viewer (legacy)
│   │   │   ├── QueryWorkbench.jsx         # Interactive FOL query & resolution refutation workbench
│   │   │   └── Sidebar.jsx                # Responsive navigation sidebar
│   │   ├── data/
│   │   │   └── legalDomainData.js         # Case data, situation cards, and CPA rules reference
│   │   ├── services/
│   │   │   └── api.js                     # Centralized API service connecting to Flask
│   │   ├── App.css                        # Supplementary layout CSS
│   │   ├── App.jsx                        # Root React component and view switcher
│   │   ├── index.css                      # Design system styles and colour palette
│   │   └── main.jsx                       # React DOM entry point
│   ├── .gitignore                  # Frontend git ignore rules
│   ├── .oxlintrc.json              # Oxlint linter configuration
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Frontend dependencies and npm scripts
│   ├── package-lock.json           # Locked npm dependency tree
│   └── vite.config.js              # Vite config with React plugin and /api proxy
├── .gitignore                      # Git ignore patterns
└── README.md                       # Main project documentation
```

---

## Setup & Running (Windows PowerShell)

### Prerequisites
- Python 3.10+ (tested with Python 3.13)
- Node.js 18+ and npm

### 1. Backend Setup
Open a Windows PowerShell terminal in the project root directory:

```powershell
# Navigate to your project root
cd <path-to-project-root>\consumer-rights-advisor

# Install Python dependencies
python -m pip install -r backend/requirements.txt

# Start the Flask backend server
python backend/app.py
```
*The Flask API starts on `http://127.0.0.1:5000`.*

### 2. Frontend Setup
Open a second Windows PowerShell terminal:

```powershell
# From the project root, navigate to the frontend directory
cd <path-to-project-root>\consumer-rights-advisor\frontend

# Install npm dependencies
cmd /c "npm install"

# Start the Vite development server
cmd /c "npm run dev"
```
*(Note: `cmd /c` is used on Windows PowerShell to invoke npm when local PowerShell script execution policies restrict direct `.ps1` execution).*

*The frontend application opens on `http://localhost:5173`.*

---

## Testing & Quality Verification

### 1. Backend Unit & Integration Tests
The backend test suite in `backend/test_logic_engine.py` contains exactly **91 tests** organized into five test classes:
- `TestTermsAndPredicates` (3 tests): Variable creation, constant creation, predicate arity and ground checks.
- `TestSubstitution` (4 tests): Empty substitution, variable-to-constant binding, predicate grounding, variable dereferencing.
- `TestUnification` (60 tests): Robinson unification algorithm, occurs-check cycle prevention, Horn clause derivations, backward/forward chaining, clause standardization apart, and resolution refutation.
- `TestConsumerLawKnowledgeBase` (17 tests): Distinction between allegations and findings, laboratory testing orders, procedural rules, commercial exclusions, and relief eligibility.
- `TestResolveApiEndpoint` (7 tests): Flask REST integration tests verifying `/api/resolve`, error handling (400 validation), `/api/kb`, `/api/cases`, and `/api/advisory` (including commercial exclusion checks).

Run the full test suite from the project root:

```powershell
python -m unittest discover backend
```
*Actual output: `Ran 91 tests in ~2.2s ... OK`.*

To run the test file directly:
```powershell
python -m unittest backend/test_logic_engine.py
```

### 2. Frontend Lint Checks
Run `oxlint` across all frontend JSX, JS, and CSS files:

```powershell
cmd /c "cd frontend && npm run lint"
```
*Actual output: `Found 0 warnings and 0 errors.`*

### 3. Frontend Production Build
Verify that the React production bundle compiles cleanly:

```powershell
cmd /c "cd frontend && npm run build"
```
*Actual output: `built in ~3.5s` with production artifacts emitted to `frontend/dist/`.*

---

## Known Limitations

- **Statutory Standing vs. Discretionary Relief & Outcome Guarantee**:
  The First-Order Logic engine verifies statutory complaint maintainability (standing under CPA 2019 Section 35 and consumer qualification under Section 2(7)). A maintainable complaint indicates that the consumer satisfies the legal threshold to initiate an inquiry before the Consumer Commission; it does **not** constitute proof of liability, guarantee a favorable outcome, or guarantee an order for refund, replacement, or compensation under Section 39. Final remedies remain within the exclusive judicial discretion of the Consumer Commission following formal evidence examination, laboratory testing, and hearing of opposite party defenses.
- **Horn Clause Expressiveness**:
  The inference engine operates over definite Horn clauses and positive Robinson unification. Negation is supported procedurally or through refutation resolution with ground goals, not arbitrary second-order logics or non-monotonic modal logics.
- **Resolution Proof Ground Goal Requirement**:
  The resolution theorem prover (`prove_by_resolution`) currently requires a ground goal (all arguments must be constants, with no unbound variables) and operates within a bounded search depth (`max_steps=1000`).
- **Jurisdictional Pecuniary Limits**:
  While the system directs users to the unified e-Daakhil filing platform, pecuniary thresholds (District Commission up to ₹50 Lakhs, State Commission ₹50 Lakhs to ₹2 Crores, National Commission above ₹2 Crores under 2021 notified rules) are presented as statutory jurisdictional guidance rather than automated court venue selection.
