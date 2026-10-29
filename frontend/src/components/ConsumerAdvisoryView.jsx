import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Package,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  FileText,
  PhoneCall,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { getConsumerAdvisory } from '../services/api';

const CATEGORIES = [
  {
    id: 'defective_product',
    label: 'Defective Product',
    tagline: 'Item broken, faulty hardware, or not working',
    icon: AlertTriangle,
    iconColor: 'var(--c-rosy-brown)',
    example: 'e.g., My smartphone battery overheated dangerously during charging.',
    defaultGoods: 'Smartphone',
    defaultSeller: 'Retail Store',
  },
  {
    id: 'refund_problem',
    label: 'Refund Problem',
    tagline: 'Refund refused, withheld, or delayed',
    icon: RotateCcw,
    iconColor: 'var(--c-moss-green)',
    example: 'e.g., I returned a shirt 3 weeks ago, but the seller refused to refund my payment.',
    defaultGoods: 'Returned Item',
    defaultSeller: 'E-Commerce Platform',
  },
  {
    id: 'delivery_issue',
    label: 'Delivery Issue',
    tagline: 'Item not delivered, late, or wrong package',
    icon: Package,
    iconColor: 'var(--c-midnight-green)',
    example: 'e.g., Courier marked my package delivered, but I never received it.',
    defaultGoods: 'Online Order',
    defaultSeller: 'Online Merchant',
  },
  {
    id: 'warranty_denied',
    label: 'Warranty Denied',
    tagline: 'Repair refused or customer blamed for damage',
    icon: ShieldAlert,
    iconColor: 'var(--c-dark-green)',
    example: 'e.g., Authorized service center refused repair under warranty, falsely alleging water damage.',
    defaultGoods: 'Warrantied Device',
    defaultSeller: 'Authorized Service Center',
  },
];

export default function ConsumerAdvisoryView({ onOpenInspector, onSelectCase }) {
  // Category selection (Defective Product, Refund Problem, Delivery Issue, Warranty Denied)
  const [category, setCategory] = useState('defective_product');

  // "What went wrong?" prominent input
  const [problemDescription, setProblemDescription] = useState('');

  // Essential follow-up questions
  const [hasInvoice, setHasInvoice] = useState('yes'); // 'yes' | 'no'
  const [sellerNotified, setSellerNotified] = useState('yes'); // 'yes' | 'no'
  const [purchaseType, setPurchaseType] = useState('personal'); // 'personal' | 'business'
  const [hasInspectionReport, setHasInspectionReport] = useState('no'); // 'yes' | 'no'

  // Additional optional entity details (collapsible or clean)
  const [goodsName, setGoodsName] = useState('');
  const [sellerName, setSellerName] = useState('');

  // Results & Loading state
  const [loading, setLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showLogicDetails, setShowLogicDetails] = useState(false);

  const selectedCategoryObj =
    CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat && (!goodsName || goodsName === selectedCategoryObj.defaultGoods)) {
      setGoodsName(cat.defaultGoods);
    }
  };

  const handleUseExample = (catId) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setCategory(catId);
      setProblemDescription(cat.example.replace(/^e\.g\.,\s*/i, ''));
      setGoodsName(cat.defaultGoods);
      setSellerName(cat.defaultSeller);
      setHasInvoice('yes');
      setSellerNotified('yes');
      setPurchaseType('personal');
    }
  };

  // Primary action: Get Help
  const handleGetHelp = async (e) => {
    if (e) e.preventDefault();

    if (!problemDescription.trim()) {
      setErrorMessage('Please briefly describe what went wrong in the text box below.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const payload = {
      category,
      description: problemDescription.trim(),
      has_invoice: hasInvoice === 'yes',
      seller_notified: sellerNotified === 'yes',
      commercial_purpose: purchaseType === 'business',
      inspection_report: hasInspectionReport === 'yes',
      consumer_name: 'Consumer',
      goods_name: goodsName.trim() || selectedCategoryObj.defaultGoods,
      seller_name: sellerName.trim() || selectedCategoryObj.defaultSeller,
    };

    const res = await getConsumerAdvisory(payload);

    setLoading(false);

    if (res.success && res.data) {
      setAdvisoryResult(res.data);
      // Smooth scroll down to results
      setTimeout(() => {
        const resultsEl = document.getElementById('advisory-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setErrorMessage(
        res.error ||
          'Could not connect to the backend logic engine. Ensure python backend/app.py is running on http://127.0.0.1:5000.'
      );
    }
  };

  const handleReset = () => {
    setAdvisoryResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="tab-panel" id="consumer-advisory-main">
      {/* =========================================================================
          HOMEPAGE: Clean, Consumer-First Problem Solver
          - Headline: "Let's solve your consumer problem."
          - Prominent text box: "What went wrong?"
          - Four simple categories: Defective Product, Refund Problem, Delivery Issue, Warranty Denied
          - One clear primary button: "Get Help"
          ========================================================================= */}
      <section
        className="research-card"
        style={{
          padding: '32px 28px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '28px',
        }}
      >
        {/* Short Headline */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.1rem',
              color: 'var(--c-dark-green)',
              margin: '0 0 6px 0',
              fontWeight: 700,
            }}
          >
            Let's solve your consumer problem.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '620px', margin: '0 auto' }}>
            Get practical rights, clear options, and immediate next steps under Indian Consumer Law.
          </p>
        </div>

        <form onSubmit={handleGetHelp}>
          {/* Four Simple Categories */}
          <div style={{ marginBottom: '22px' }}>
            <label
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: 'var(--c-dark-green)',
                marginBottom: '10px',
              }}
            >
              Select your issue type:
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '12px',
              }}
            >
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '14px',
                      background: isSelected ? 'var(--c-beige-tint)' : '#ffffff',
                      border: isSelected
                        ? '2px solid var(--c-moss-green)'
                        : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? 'var(--shadow-subtle)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '6px',
                        width: '100%',
                      }}
                    >
                      <IconComponent size={20} style={{ color: cat.iconColor, flexShrink: 0 }} />
                      <strong
                        style={{
                          fontSize: '0.92rem',
                          color: isSelected ? 'var(--c-dark-green)' : 'var(--text-main)',
                        }}
                      >
                        {cat.label}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                      {cat.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prominent Text Box: "What went wrong?" */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <label
                htmlFor="what-went-wrong-input"
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--c-dark-green)',
                }}
              >
                What went wrong?
              </label>
              <button
                type="button"
                onClick={() => handleUseExample(category)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--c-moss-green)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Use sample issue
              </button>
            </div>
            <textarea
              id="what-went-wrong-input"
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={`Describe your problem in plain words (${selectedCategoryObj.example})`}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '0.96rem',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.5,
                border: '1.5px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                background: '#ffffff',
                color: 'var(--text-main)',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {/* Follow-up Questions (Essential Information Check) */}
          <div
            style={{
              background: 'var(--bg-surface-warm)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px 18px',
              marginBottom: '22px',
            }}
          >
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--c-dark-green)', marginBottom: '12px' }}>
              Quick details to tailor your advice:
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Question 1: Proof of Purchase */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Do you have the bill, invoice, or payment receipt?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setHasInvoice('yes')}
                    className={`chip-btn ${hasInvoice === 'yes' ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                  >
                    Yes, I have it
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasInvoice('no')}
                    className={`chip-btn ${hasInvoice === 'no' ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                  >
                    No / Lost receipt
                  </button>
                </div>
              </div>

              {/* Question 2: Seller Contacted */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Have you notified the seller or brand in writing?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSellerNotified('yes')}
                    className={`chip-btn ${sellerNotified === 'yes' ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                  >
                    Yes, already notified
                  </button>
                  <button
                    type="button"
                    onClick={() => setSellerNotified('no')}
                    className={`chip-btn ${sellerNotified === 'no' ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                  >
                    Not yet
                  </button>
                </div>
              </div>

              {/* Question 3: Personal or Business */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Was this bought for personal use or business resale?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setPurchaseType('personal')}
                    className={`chip-btn ${purchaseType === 'personal' ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                  >
                    Personal use
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchaseType('business')}
                    className={`chip-btn ${purchaseType === 'business' ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                  >
                    Business / Fleet use
                  </button>
                </div>
              </div>

              {/* Question 4: Technical Report (Warranty or Defect) */}
              {(category === 'warranty_denied' || category === 'defective_product') && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                    Do you have a written technician inspection report or job sheet?
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setHasInspectionReport('yes')}
                      className={`chip-btn ${hasInspectionReport === 'yes' ? 'active' : ''}`}
                      style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                    >
                      Yes, have written report
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasInspectionReport('no')}
                      className={`chip-btn ${hasInspectionReport === 'no' ? 'active' : ''}`}
                      style={{ fontSize: '0.8rem', padding: '5px 14px' }}
                    >
                      No report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Optional Names Fields */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Item / Product Name (Optional):
              </label>
              <input
                type="text"
                value={goodsName}
                onChange={(e) => setGoodsName(e.target.value)}
                placeholder={selectedCategoryObj.defaultGoods}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.86rem',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Merchant / Brand Name (Optional):
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder={selectedCategoryObj.defaultSeller}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.86rem',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--c-rosy-brown-light)',
                border: '1px solid var(--c-rosy-brown)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--c-dark-green)',
                fontSize: '0.86rem',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={18} style={{ color: 'var(--c-rosy-brown)', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* One Clear Primary Button: "Get Help" */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              id="btn-get-help"
              style={{
                background: 'var(--c-moss-green)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-card)',
                transition: 'background-color 0.15s ease',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin-animation" />
                  <span>Evaluating your options...</span>
                </>
              ) : (
                <>
                  <span>Get Help</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {advisoryResult && (
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
                style={{ fontSize: '0.86rem', padding: '10px 16px' }}
              >
                Ask Another Question
              </button>
            )}

            {onSelectCase && (
              <button
                type="button"
                onClick={onSelectCase}
                className="btn-secondary"
                style={{ fontSize: '0.86rem', padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <BookOpen size={14} />
                <span>Read Consumer Stories</span>
              </button>
            )}
          </div>
        </form>
      </section>

      {/* =========================================================================
          RESULTS SECTION: Concise answer in strict order:
          1. Your situation: one or two sentences
          2. What you may be able to do: relevant rights & options in plain English
          3. Your next steps: short numbered checklist
          4. Keep these documents: only relevant evidence
          5. Need more help?: appropriate official consumer grievance channels
          ========================================================================= */}
      {advisoryResult && (
        <section
          id="advisory-results-section"
          className="research-card"
          style={{
            padding: '30px 28px',
            background: '#ffffff',
            border: '1.5px solid var(--c-moss-green)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '28px',
          }}
        >
          {/* Header indicator */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '14px',
              marginBottom: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={22} style={{ color: 'var(--c-moss-green)' }} />
              <h2 style={{ fontSize: '1.3rem', color: 'var(--c-dark-green)', margin: 0 }}>
                Your Consumer Guidance
              </h2>
            </div>
            <span
              className="statutory-badge"
              style={{
                background: 'var(--c-beige-darker)',
                color: 'var(--c-dark-green)',
                fontWeight: 700,
              }}
            >
              {selectedCategoryObj.label}
            </span>
          </div>

          {/* 1. YOUR SITUATION (One or two sentences, distinguishing allegation from finding) */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1rem',
                color: 'var(--c-dark-green)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  background: 'var(--c-dark-green)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                1
              </span>
              Your situation
            </h3>
            <div
              style={{
                background: 'var(--bg-surface-warm)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '4px solid var(--c-moss-green)',
                padding: '14px 16px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontSize: '0.94rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
              }}
            >
              {advisoryResult.situation}
            </div>
          </div>

          {/* 2. WHAT YOU MAY BE ABLE TO DO (Relevant rights and options in plain English) */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1rem',
                color: 'var(--c-dark-green)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  background: 'var(--c-dark-green)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                2
              </span>
              What you may be able to do
            </h3>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
              }}
            >
              <ul
                style={{
                  paddingLeft: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.92rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.55,
                }}
              >
                {advisoryResult.what_you_can_do?.map((option, idx) => (
                  <li key={idx} style={{ paddingLeft: '4px' }}>
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. YOUR NEXT STEPS (A short numbered checklist) */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1rem',
                color: 'var(--c-dark-green)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  background: 'var(--c-dark-green)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                3
              </span>
              Your next steps
            </h3>
            <div
              style={{
                background: 'var(--c-beige-tint)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 20px',
              }}
            >
              <ol
                style={{
                  paddingLeft: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.92rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.55,
                }}
              >
                {advisoryResult.next_steps?.map((step, idx) => (
                  <li key={idx} style={{ paddingLeft: '4px', fontWeight: 500 }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 4. KEEP THESE DOCUMENTS (Only relevant evidence) */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1rem',
                color: 'var(--c-dark-green)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  background: 'var(--c-dark-green)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                4
              </span>
              Keep these documents
            </h3>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '8px',
                }}
              >
                {advisoryResult.keep_documents?.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.86rem',
                      color: 'var(--text-main)',
                      padding: '6px 8px',
                      background: 'var(--bg-surface-warm)',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    <FileText size={15} style={{ color: 'var(--c-moss-green)', flexShrink: 0 }} />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. NEED MORE HELP? (Official consumer grievance channels) */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1rem',
                color: 'var(--c-dark-green)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  background: 'var(--c-dark-green)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                5
              </span>
              Need more help?
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
              }}
            >
              {advisoryResult.official_channels?.map((channel, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface-warm)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--c-dark-green)', display: 'block' }}>
                      {channel.name}
                    </strong>
                    {channel.phone && (
                      <div
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--c-moss-green)',
                          fontWeight: 700,
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <PhoneCall size={13} />
                        <span>{channel.phone}</span>
                      </div>
                    )}
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {channel.description}
                    </p>
                  </div>
                  {channel.url && (
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: '10px',
                        fontSize: '0.78rem',
                        color: 'var(--c-dark-green)',
                        textDecoration: 'none',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Visit portal</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Missing Information Notice / Follow-up Questions */}
          {advisoryResult.follow_up_questions?.length > 0 && (
            <div
              style={{
                background: 'var(--c-beige-tint)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--c-dark-green)', marginBottom: '6px' }}>
                Follow-up checks for your case:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-main)', margin: 0 }}>
                {advisoryResult.follow_up_questions.map((q, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {q.question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Brief, Unobtrusive Legal Disclaimer */}
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '12px',
              fontSize: '0.74rem',
              color: 'var(--text-subtle)',
              lineHeight: 1.45,
            }}
          >
            <strong>Note:</strong> This guidance is provided for consumer problem-solving under the provisions of the
            Consumer Protection Act, 2019 (India). It does not constitute formal legal representation or guarantee court
            outcomes. Relief under Section 39 is a judicial decision made by the Consumer Commission upon examination of
            evidence.
          </div>

          {/* Academic Evaluator Expandable Drawer */}
          <div style={{ marginTop: '16px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={() => setShowLogicDetails((prev) => !prev)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                color: 'var(--text-muted)',
                fontSize: '0.76rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Cpu size={13} style={{ color: 'var(--c-midnight-green)' }} />
              <span>
                {showLogicDetails
                  ? 'Hide First-Order Logic Proof Details (Academic Evaluators)'
                  : 'Show First-Order Logic Proof Details (Academic Evaluators)'}
              </span>
              {showLogicDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showLogicDetails && advisoryResult.logic_proof && (
              <div
                style={{
                  marginTop: '10px',
                  background: 'var(--c-midnight-green-tint)',
                  border: '1px solid var(--border-midnight)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  color: 'var(--text-white)',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--c-beige)' }}>
                  AIMA First-Order Logic Inference Verification
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  Goal Predicate: {advisoryResult.logic_proof.goal}
                </div>
                <div style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
                  Status: <strong>{advisoryResult.logic_proof.proved ? 'PROVED via Horn clause forward deduction' : 'NOT PROVED'}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '10px' }}>
                  {advisoryResult.limitations}
                </div>
                {onOpenInspector && (
                  <button
                    type="button"
                    className="btn-academic-secondary"
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                    onClick={() =>
                      onOpenInspector({
                        predicate: 'maintainable_complaint',
                        args: ['Consumer', selectedCategoryObj.defaultSeller, selectedCategoryObj.defaultGoods],
                        caseTitle: `Evaluated ${selectedCategoryObj.label}`,
                        expected: advisoryResult.logic_proof.proved,
                      })
                    }
                  >
                    Open in Logic Workbench
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
