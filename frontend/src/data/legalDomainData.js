/**
 * Reference domain models and educational cases based on:
 * - Indian Consumer Protection Act, 2019 (CPA 2019)
 * - backend/knowledge_base.py
 * - Active backend/app.py KB rules
 */

export const CPA_CASE_STUDIES = [
  {
    id: 'case_ramesh',
    title: 'Case 1: Ramesh vs. TechMart India',
    subtitle: 'Allegation Stage Only (Inquiry Pending)',
    tag: 'Allegation Stage',
    tagColor: 'amber',
    statutoryRef: 'CPA 2019 Section 35',
    consumer: 'Ramesh',
    goods: 'Smartphone_Model_Z',
    seller: 'TechMart_India',
    allegation: 'Battery_Overheating_Issue',
    problem:
      'Ramesh bought a Smartphone Model Z for ₹18,000 from TechMart India. Within two weeks, the battery overheated dangerously during normal charging. When he approached TechMart, they refused a replacement, claiming it was normal wear. Ramesh filed a complaint with the District Consumer Commission.',
    whatMatters:
      'Ramesh has a valid invoice and paid consideration, so he qualifies as a consumer under Section 2(7). At this initial stage, his claim is an allegation under Section 35, giving him legal standing to file a complaint. However, an allegation is not automatic proof of liability; statutory remedies under Section 39 require formal inquiry or laboratory testing under Section 38(2)(c).',
    possibleOptions:
      'Ramesh can request the District Commission to send the phone to a government-recognized testing laboratory. If the lab confirms the battery defect, the Commission has the statutory authority to order replacement, free repair, or a full refund plus compensation. He can also seek informal conciliation via the National Consumer Helpline (1915).',
    nextSteps: [
      'Preserve the original tax invoice, charger, warranty card, and customer care email chats.',
      'Serve a formal 15-day written notice to TechMart India demanding replacement or repair.',
      'Lodge a grievance on the National Consumer Helpline (NCH 1915 or consumerhelpline.gov.in).',
      'If unresolved, file petition before the District Commission via e-Daakhil (edaakhil.nic.in) requesting testing under Section 38(2)(c).',
    ],
    summary:
      'Ramesh purchased a smartphone and alleges extreme overheating during charging. TechMart India denies liability. The complaint is admitted for inquiry, but NO judicial finding of defect has been reached yet.',
    legalPrinciple:
      'Under CPA 2019, an allegation in a complaint is NOT proof of liability. The consumer has standing (maintainable_complaint), but does NOT automatically qualify for relief without a formal Section 38 finding.',
    assertedFacts: [
      { predicate: 'purchased', args: ['Ramesh', 'Smartphone_Model_Z', 'TechMart_India'] },
      { predicate: 'paid_consideration', args: ['Ramesh', 'Smartphone_Model_Z'] },
      { predicate: 'alleges_defect', args: ['Ramesh', 'Smartphone_Model_Z', 'Battery_Overheating_Issue'] },
      { predicate: 'opposite_party_denies', args: ['TechMart_India', 'Battery_Overheating_Issue'] },
    ],
    testQueries: [
      {
        label: 'Consumer Status',
        predicate: 'is_consumer',
        args: ['Ramesh', 'Smartphone_Model_Z'],
        expected: true,
        note: 'Purchased for consideration',
      },
      {
        label: 'Maintainable Complaint',
        predicate: 'maintainable_complaint',
        args: ['Ramesh', 'TechMart_India', 'Smartphone_Model_Z'],
        expected: true,
        note: 'Consumer has standing under Sec 35',
      },
      {
        label: 'Defect Finding (Judicial)',
        predicate: 'commission_finding_defect',
        args: ['District_Commission', 'Smartphone_Model_Z', 'Battery_Overheating_Issue'],
        expected: false,
        note: 'CRITICAL: No finding exists yet; allegation != finding',
      },
      {
        label: 'Relief Eligibility',
        predicate: 'eligible_for_relief_consideration',
        args: ['Ramesh', 'Smartphone_Model_Z'],
        expected: false,
        note: 'Relief requires established defect finding',
      },
    ],
  },
  {
    id: 'case_priya',
    title: 'Case 2: Priya vs. PureWater Solutions',
    subtitle: 'Adjudicated Finding with Statutory Relief',
    tag: 'Relief Ordered',
    tagColor: 'emerald',
    statutoryRef: 'CPA 2019 Sections 38(2)(c) & 39',
    consumer: 'Priya',
    goods: 'AquaPure_RO_System',
    seller: 'PureWater_Solutions',
    allegation: 'Contaminated_Filtration_Defect',
    problem:
      'Priya purchased an AquaPure RO water purifier for ₹15,000. Soon after installation, the purifier dispensed yellowish water with a strong chemical smell. The technician dismissed the issue. Priya filed a complaint with District Commission Delhi.',
    whatMatters:
      'The District Commission sent the unit for accredited laboratory testing under Section 38(2)(c). The government testing laboratory confirmed a torn membrane leaking contaminants. This officially converted Priya’s allegation into an established judicial finding of defect.',
    possibleOptions:
      'Because an established finding of defect was officially recorded, Priya is eligible for statutory relief under Section 39. The Commission ordered full replacement of the purifier unit plus compensation for mental harassment and litigation costs.',
    nextSteps: [
      'Ensure the government testing laboratory report under Section 38(2)(c) is formally placed on the court record.',
      'Petition the Consumer Commission for formal relief under Section 39 (replacement or full refund plus compensation).',
      'If the opposite party fails to comply with the order within 30 days, file for enforcement under Section 71/72.',
    ],
    summary:
      'Priya reported contaminated water from a newly installed RO system. District Commission Delhi sent the unit for statutory laboratory testing. The government lab report confirmed membrane defect. The Commission formally entered a finding of defect and ordered unit replacement.',
    legalPrinciple:
      'Under Section 38, evidence from an accredited testing lab converts an allegation into an adjudicated finding of defect, unlocking judicial remedies under Section 39.',
    assertedFacts: [
      { predicate: 'purchased', args: ['Priya', 'AquaPure_RO_System', 'PureWater_Solutions'] },
      { predicate: 'paid_consideration', args: ['Priya', 'AquaPure_RO_System'] },
      { predicate: 'alleges_defect', args: ['Priya', 'AquaPure_RO_System', 'Contaminated_Filtration_Defect'] },
      { predicate: 'complaint_admitted', args: ['District_Commission_Delhi', 'Case_2023_101', 'Priya', 'PureWater_Solutions'] },
      { predicate: 'lab_analysis_ordered', args: ['District_Commission_Delhi', 'AquaPure_RO_System'] },
      { predicate: 'lab_report_confirms_defect', args: ['AquaPure_RO_System', 'Contaminated_Filtration_Defect'] },
      { predicate: 'commission_finding_defect', args: ['District_Commission_Delhi', 'AquaPure_RO_System', 'Contaminated_Filtration_Defect'] },
      { predicate: 'commission_ordered_relief', args: ['District_Commission_Delhi', 'Priya', 'PureWater_Solutions', 'Replace_Purifier_Unit'] },
    ],
    testQueries: [
      {
        label: 'Defect Formally Proven',
        predicate: 'commission_finding_defect',
        args: ['District_Commission_Delhi', 'AquaPure_RO_System', 'Contaminated_Filtration_Defect'],
        expected: true,
        note: 'Judicially confirmed via lab test report',
      },
      {
        label: 'Eligible for Relief',
        predicate: 'eligible_for_relief_consideration',
        args: ['Priya', 'AquaPure_RO_System'],
        expected: true,
        note: 'Qualifies under Sec 38/39 Horn rule',
      },
    ],
  },
  {
    id: 'case_apex',
    title: 'Case 3: Apex Logistics vs. SpeedMotors Ltd',
    subtitle: 'Commercial Purpose Statutory Exclusion',
    tag: 'Excluded Commercial',
    tagColor: 'rose',
    statutoryRef: 'CPA 2019 Section 2(7)',
    consumer: 'Apex_Logistics_Pvt_Ltd',
    goods: 'Commercial_Fleet_Vans',
    seller: 'SpeedMotors_Ltd',
    allegation: 'Brake_Wear_Defect',
    problem:
      'Apex Logistics purchased 10 delivery vans for commercial freight operations. Several vans experienced premature brake wear. Apex wanted to file a case in the Consumer Commission for replacement and business loss compensation.',
    whatMatters:
      'Under Section 2(7) of the Consumer Protection Act, 2019, any person or company that purchases goods for commercial purpose or resale is explicitly excluded from consumer courts. The single exception is when an individual purchases goods exclusively to earn livelihood through personal self-employment. Because Apex is a commercial logistics business, the Consumer Commission has no jurisdiction.',
    possibleOptions:
      'Apex Logistics cannot file before the Consumer Commission. Apex must seek commercial breach of contract or warranty remedies in Commercial Civil Courts under the Sale of Goods Act, 1930 and Indian Contract Act, 1872, or through contractually agreed arbitration.',
    nextSteps: [
      'Review the commercial sales contract and warranty terms for dispute resolution or arbitration clauses.',
      'Serve a formal legal notice of breach of warranty under the Indian Contract Act giving 15 to 30 days to remedy.',
      'File a commercial suit in the appropriate Commercial Civil Court or initiate arbitration.',
    ],
    summary:
      'Apex Logistics purchased 10 delivery vans for commercial freight operations and alleged premature brake wear. SpeedMotors contends the buyer is not a consumer under CPA 2019.',
    legalPrinciple:
      'Section 2(7) explicitly excludes purchasers who acquire goods for commercial resale or large-scale business operations, unless solely for earning personal livelihood via self-employment.',
    assertedFacts: [
      { predicate: 'purchased', args: ['Apex_Logistics_Pvt_Ltd', 'Commercial_Fleet_Vans', 'SpeedMotors_Ltd'] },
      { predicate: 'paid_consideration', args: ['Apex_Logistics_Pvt_Ltd', 'Commercial_Fleet_Vans'] },
      { predicate: 'commercial_purpose', args: ['Apex_Logistics_Pvt_Ltd', 'Commercial_Fleet_Vans'] },
      { predicate: 'alleges_defect', args: ['Apex_Logistics_Pvt_Ltd', 'Commercial_Fleet_Vans', 'Brake_Wear_Defect'] },
    ],
    testQueries: [
      {
        label: 'Commercial Purpose Check',
        predicate: 'commercial_purpose',
        args: ['Apex_Logistics_Pvt_Ltd', 'Commercial_Fleet_Vans'],
        expected: true,
        note: 'Commercial entity exclusion',
      },
    ],
  },
  {
    id: 'case_vikram',
    title: 'Case 4: Vikram vs. AutoDrive Dealership',
    subtitle: 'Dismissed Claim (Consumer Mishandling)',
    tag: 'Dismissed / No Defect',
    tagColor: 'slate',
    statutoryRef: 'CPA 2019 Section 38',
    consumer: 'Vikram',
    goods: 'CitySedan_V6',
    seller: 'AutoDrive_Dealership',
    allegation: 'Alleged_Engine_Knocking',
    problem:
      'Vikram bought a sedan and noticed severe engine knocking after 6 months. He demanded a free engine replacement under warranty. The dealership refused, arguing Vikram used adulterated fuel and skipped scheduled service intervals.',
    whatMatters:
      'The District Commission ordered a technical inspection under Section 38. The independent technical report proved the engine failure was caused by contaminated fuel and improper maintenance, rather than an inherent manufacturing defect. The Commission formally entered a finding of no defect.',
    possibleOptions:
      'Under Section 38 of CPA 2019, if evidence establishes that breakdown was caused by consumer negligence or misuse rather than a manufacturing defect, warranty liability cannot be enforced against the dealership. The complaint was lawfully dismissed.',
    nextSteps: [
      'Always maintain official authorized service slips and fuel purchase receipts to defend against allegations of misuse.',
      'If facing an unfair refusal, obtain an independent diagnostic report before approaching the Commission.',
    ],
    summary:
      'Vikram alleged engine knocking in a purchased vehicle. Commission inquiry and technical inspection proved the issue was caused by improper fuel usage and consumer mishandling, not a manufacturing defect.',
    legalPrinciple:
      'A Commission finding of no defect bars entitlement to statutory relief against the dealership under Section 38.',
    assertedFacts: [
      { predicate: 'purchased', args: ['Vikram', 'CitySedan_V6', 'AutoDrive_Dealership'] },
      { predicate: 'paid_consideration', args: ['Vikram', 'CitySedan_V6'] },
      { predicate: 'alleges_defect', args: ['Vikram', 'CitySedan_V6', 'Alleged_Engine_Knocking'] },
      { predicate: 'complaint_admitted', args: ['District_Commission_Bengaluru', 'Case_2023_205', 'Vikram', 'AutoDrive_Dealership'] },
      { predicate: 'commission_finding_no_defect', args: ['District_Commission_Bengaluru', 'CitySedan_V6', 'Consumer_Mishandling'] },
    ],
    testQueries: [
      {
        label: 'Commission Finding: No Defect',
        predicate: 'commission_finding_no_defect',
        args: ['District_Commission_Bengaluru', 'CitySedan_V6', 'Consumer_Mishandling'],
        expected: true,
        note: 'Judicial finding recorded against defect',
      },
      {
        label: 'Relief Eligibility',
        predicate: 'eligible_for_relief_consideration',
        args: ['Vikram', 'CitySedan_V6'],
        expected: false,
        note: 'Relief denied due to consumer mishandling finding',
      },
    ],
  },
];

/**
 * Pre-configured presets specifically matching the current active backend/app.py KB
 * so the user can test live server queries immediately.
 */
export const ACTIVE_FLASK_PRESETS = [
  {
    label: 'ValidPurchase(Ramesh)',
    category: 'Direct Fact',
    predicate: 'ValidPurchase',
    args: ['Ramesh'],
    expectedProof: true,
    description: 'Explicitly asserted fact in active backend/app.py',
  },
  {
    label: 'PurchaseRecord(Ramesh)',
    category: 'Derived (1-Rule)',
    predicate: 'PurchaseRecord',
    args: ['Ramesh'],
    expectedProof: true,
    description: 'Derived via rule: PurchaseRecord(?x) :- ValidPurchase(?x)',
  },
  {
    label: 'ConsumerVerified(Ramesh)',
    category: 'Derived (2-Rule Chain)',
    predicate: 'ConsumerVerified',
    args: ['Ramesh'],
    expectedProof: true,
    description: 'Chained derivation: ValidPurchase -> PurchaseRecord -> ConsumerVerified',
  },
  {
    label: 'NeedsReview(Ramesh, Smartphone_Model_Z)',
    category: 'Derived (2 Arguments)',
    predicate: 'NeedsReview',
    args: ['Ramesh', 'Smartphone_Model_Z'],
    expectedProof: true,
    description: 'Derived via rule: NeedsReview(?c, ?p) :- ReportsDefect(?c, ?p)',
  },
  {
    label: 'ReportsDefect(Ramesh, Smartphone_Model_Z)',
    category: 'Direct Fact',
    predicate: 'ReportsDefect',
    args: ['Ramesh', 'Smartphone_Model_Z'],
    expectedProof: true,
    description: 'Explicitly asserted defect allegation in active backend/app.py',
  },
  {
    label: 'ValidPurchase(Vikram) [Unprovable]',
    category: 'Negative Test',
    predicate: 'ValidPurchase',
    args: ['Vikram'],
    expectedProof: false,
    description: 'Not in KB; should return proved=false',
  },
];

export const CPA_RULES_REFERENCE = [
  {
    id: 'R1',
    head: 'is_consumer(?Consumer, ?Goods)',
    body: ['purchased(?Consumer, ?Goods, ?Seller)', 'paid_consideration(?Consumer, ?Goods)'],
    statute: 'CPA 2019 Sec 2(7)',
    comment: 'A person qualifies prima facie as a consumer for goods if they purchased them for consideration from a seller.',
  },
  {
    id: 'R2',
    head: 'maintainable_complaint(?Consumer, ?Seller, ?Goods)',
    body: ['is_consumer(?Consumer, ?Goods)', 'alleges_defect(?Consumer, ?Goods, ?Defect)', 'purchased(?Consumer, ?Goods, ?Seller)'],
    statute: 'CPA 2019 Sec 35',
    comment: 'A complaint alleging defect is maintainable for inquiry if filed by a qualifying consumer against the seller. Initiates inquiry only.',
  },
  {
    id: 'R3',
    head: 'eligible_for_relief_consideration(?Consumer, ?Goods)',
    body: ['is_consumer(?Consumer, ?Goods)', 'commission_finding_defect(?Commission, ?Goods, ?Defect)'],
    statute: 'CPA 2019 Sec 38 & 39',
    comment: 'Remedial adjudication requires an established commission finding of defect. An allegation alone is legally insufficient.',
  },
];

/**
 * Consumer-Friendly Situation Cards for the simplified main dashboard.
 * Designed for ordinary citizens to explore common disputes with clear plain-language guidance.
 */
export const CONSUMER_SITUATION_CARDS = [
  {
    id: 'defective_product',
    title: 'Defective Product',
    simpleLabel: 'Defective Product (Gadgets, Appliances & Goods)',
    badge: 'Section 35 Standing',
    badgeColor: 'amber',
    iconName: 'AlertTriangle',
    shortDesc: 'Product suffers from manufacturing faults, battery heating, screen defects, or breakdown.',
    exampleText: 'e.g. Smartphone battery overheating or home appliance stopped working',
    consumerName: 'Consumer',
    goodsName: 'Defective_Goods',
    sellerName: 'Merchant_Store',
    issueType: 'Manufacturing_Defect',
    category: 'Defective Product',
    keywords: [
      'phone', 'mobile', 'smartphone', 'battery', 'heating', 'overheating',
      'charger', 'hardware', 'defect', 'fault', 'broken', 'screen', 'laptop',
      'tablet', 'appliance', 'gadget', 'dead', 'electronics', 'damaged', 'mixer',
      'tv', 'refrigerator', 'washing machine', 'ac', 'cooler'
    ],
    possibleRights: [
      'Right to file an inquiry complaint under Section 35 of the Consumer Protection Act, 2019.',
      'Right to request government accredited laboratory testing under Section 38(2)(c) if the defect is denied.',
      'Potential remedies under Section 39: repair free of cost, replacement with a new unit, or full refund plus compensation.',
      'Relief is awarded upon formal proof or conciliation; an allegation alone initiates proceedings but does not guarantee automatic payment.'
    ],
    nextSteps: [
      'Preserve the defective product in its current state; avoid unauthorized third-party repairs.',
      'Send a formal 15-day written notice to the merchant and manufacturer requesting replacement or repair.',
      'Register an informal grievance on the National Consumer Helpline (NCH - toll free 1915 or consumerhelpline.gov.in).',
      'If unresolved, file a petition before the District Consumer Commission via e-Daakhil (edaakhil.nic.in).'
    ],
  },
  {
    id: 'refund_problem',
    title: 'Refund Problem',
    simpleLabel: 'Refund Problem (Withheld, Delayed, or Refused)',
    badge: 'Section 2(47) Unfair Trade',
    badgeColor: 'emerald',
    iconName: 'RefreshCw',
    shortDesc: 'Refund refused or delayed after product return, order cancellation, or failed service.',
    exampleText: 'e.g. Returned an online item 3 weeks ago but seller refuses to process refund',
    consumerName: 'Consumer',
    goodsName: 'Returned_Order',
    sellerName: 'Retail_Platform',
    issueType: 'Refund_Withheld',
    category: 'Refund Problem',
    keywords: [
      'refund', 'money', 'return', 'credit', 'payment', 'cancel', 'deducted',
      'reversed', 'cashback', 'wallet', 'bank', 'delay', 'charge', 'failed transaction',
      'withheld', 'refused refund', 'flipkart', 'amazon', 'zomato', 'swiggy'
    ],
    possibleRights: [
      'Protection against Unfair Trade Practice: Under Section 2(47) of CPA 2019 and E-Commerce Rules 2020, withholding or delaying legitimate refunds is illegal.',
      'Right to 100% refund of consideration paid, along with statutory interest for the delayed period.',
      'Right to raise a formal payment dispute or chargeback through your bank or payment gateway.',
      'Under Section 39, the Consumer Commission can order immediate refund disbursement plus compensation for harassment.'
    ],
    nextSteps: [
      'Gather return pickup receipts, courier tracking screenshot, or cancellation confirmations.',
      'Send a final written 7-day demand to the merchant and payment provider specifying transaction IDs.',
      'Lodge a complaint on the National Consumer Helpline (call 1915 or visit consumerhelpline.gov.in).',
      'File a petition for refund with interest before the District Consumer Commission via e-Daakhil.'
    ],
  },
  {
    id: 'delivery_issue',
    title: 'Delivery Issue',
    simpleLabel: 'Delivery Issue (Non-Delivery, Delay, or Wrong Item)',
    badge: 'Section 2(11) Deficiency',
    badgeColor: 'rose',
    iconName: 'Package',
    shortDesc: 'Order was never delivered, delayed past deadlines, or arrived as a wrong or counterfeit item.',
    exampleText: 'e.g. Order marked delivered by courier but never received, or wrong item arrived',
    consumerName: 'Consumer',
    goodsName: 'Undelivered_Item',
    sellerName: 'Shipping_Merchant',
    issueType: 'Delivery_Failure',
    category: 'Delivery Issue',
    keywords: [
      'delivery', 'courier', 'late', 'delay', 'tracking', 'parcel', 'package',
      'missing', 'fake', 'counterfeit', 'wrong item', 'shipment', 'not received',
      'dispatch', 'lost in transit', 'box empty', 'soap in box'
    ],
    possibleRights: [
      'Deficiency of service: Failure to deliver within promised timelines or delivering incorrect items is a deficiency under Section 2(11).',
      'Right to cancel and receive an immediate 100% refund or demand delivery of the correct genuine product.',
      'E-Commerce Rules protection: Platforms cannot unilaterally cancel confirmed orders and must maintain delivery tracking accountability.',
      'Right to compensation under Section 39 for mental agony, loss of time, and consequential expenses.'
    ],
    nextSteps: [
      'Take screenshots of order confirmation, promised delivery date, and courier tracking status.',
      'If a wrong item was delivered, retain all packaging and record clear photos or an unboxing video.',
      'Send written notice to the seller giving 48 to 72 hours to deliver the correct product or refund.',
      'Register a grievance on the National Consumer Helpline (call 1915).',
      'File on e-Daakhil for deficiency of service if the seller fails to resolve.'
    ],
  },
  {
    id: 'warranty_denied',
    title: 'Warranty Denied',
    simpleLabel: 'Warranty Denied (Refusal, Negligence, or User Blame)',
    badge: 'Section 38 Defense',
    badgeColor: 'slate',
    iconName: 'ShieldAlert',
    shortDesc: 'Service center refuses repair under warranty, falsely alleging customer misuse or physical damage.',
    exampleText: 'e.g. Authorized center claims water damage or unauthorized repair to reject warranty',
    consumerName: 'Consumer',
    goodsName: 'Warrantied_Item',
    sellerName: 'Authorized_Service_Center',
    issueType: 'Warranty_Rejected',
    category: 'Warranty Denied',
    keywords: [
      'warranty', 'service', 'repair', 'guarantee', 'technician', 'water damage',
      'misuse', 'mishandling', 'job sheet', 'denied', 'void', 'service center',
      'unauthorized', 'liquid damage', 'screen crack', 'estimate'
    ],
    possibleRights: [
      'Right to challenge arbitrary denial: Refusing warranty without technical substantiation is a deficiency in service under Section 2(11).',
      'Burden of proof on merchant: Under Section 38, the service center cannot arbitrarily void warranty; they must provide technical diagnostic logs.',
      'Right to written job sheets and diagnostic inspection photographs from the service center.',
      'Right to request the Commission under Section 38(2)(c) to appoint an independent certified expert.',
      'Note: If certified inspection confirms user mishandling (such as liquid spill or unauthorized modifications), warranty relief is legally barred.'
    ],
    nextSteps: [
      'Demand a formal written job sheet from the service center stating the exact technical reason warranty was refused.',
      'Collect all manufacturer maintenance slips and purchase bills showing adherence to terms.',
      'Send a written escalation notice to the brand’s Grievance Officer challenging the technician’s findings.',
      'Lodge an NCH complaint (1915) for brand-level warranty conciliation.',
      'File on e-Daakhil requesting independent technical inspection under Section 38 if unresolved.'
    ],
  },
];
