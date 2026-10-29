import sys
from pathlib import Path

# Ensure backend directory is in sys.path
BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

try:
    import backend.logic_engine as logic_engine
    sys.modules["logic_engine"] = logic_engine
except ImportError:
    import logic_engine
    sys.modules["backend.logic_engine"] = logic_engine

try:
    import backend.knowledge_base as knowledge_base
    sys.modules["knowledge_base"] = knowledge_base
except ImportError:
    import knowledge_base
    sys.modules["backend.knowledge_base"] = knowledge_base
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from flask import Flask, jsonify, request

try:
    from backend.logic_engine import Constant, KnowledgeBase, Predicate, Rule, Variable
    from backend.knowledge_base import (
        build_educational_rules,
        populate_sample_cases,
        PRED_PURCHASED,
        PRED_PAID_CONSIDERATION,
        PRED_COMMERCIAL_PURPOSE,
        PRED_ALLEGES_DEFECT,
        PRED_ALLEGES_REFUND_DENIAL,
        PRED_ALLEGES_DELIVERY_FAILURE,
        PRED_ALLEGES_WARRANTY_DENIAL,
        PRED_COMMISSION_FINDING_DEFECT,
        PRED_IS_CONSUMER,
        PRED_MAINTAINABLE_COMPLAINT,
        PRED_ELIGIBLE_FOR_RELIEF_CONSIDERATION,
        PRED_EXCLUDED_COMMERCIAL,
    )
except ImportError:
    from logic_engine import Constant, KnowledgeBase, Predicate, Rule, Variable
    from knowledge_base import (
        build_educational_rules,
        populate_sample_cases,
        PRED_PURCHASED,
        PRED_PAID_CONSIDERATION,
        PRED_COMMERCIAL_PURPOSE,
        PRED_ALLEGES_DEFECT,
        PRED_ALLEGES_REFUND_DENIAL,
        PRED_ALLEGES_DELIVERY_FAILURE,
        PRED_ALLEGES_WARRANTY_DENIAL,
        PRED_COMMISSION_FINDING_DEFECT,
        PRED_IS_CONSUMER,
        PRED_MAINTAINABLE_COMPLAINT,
        PRED_ELIGIBLE_FOR_RELIEF_CONSIDERATION,
        PRED_EXCLUDED_COMMERCIAL,
    )

app = Flask(__name__)

# Create one knowledge base for the application.
kb = KnowledgeBase()
kb.add_fact(
    Predicate("ValidPurchase", [Constant("Ramesh")])
)
kb.add_fact(
    Predicate("ValidPurchase", [Constant("Priya")])
)
kb.add_fact(
    Predicate("ReportsDefect", [
        Constant("Ramesh"),
        Constant("Smartphone_Model_Z")
    ])
)
kb.add_rule(
    Rule(
        Predicate("PurchaseRecord", [Variable("x")]),
        [Predicate("ValidPurchase", [Variable("x")])]
    )
)
kb.add_rule(
    Rule(
        Predicate(
            "NeedsReview",
            [Variable("consumer"), Variable("product")]
        ),
        [
            Predicate(
                "ReportsDefect",
                [Variable("consumer"), Variable("product")]
            )
        ]
    )
)

kb.add_rule(
    Rule(
        Predicate("ConsumerVerified", [Variable("x")]),
        [Predicate("PurchaseRecord", [Variable("x")])]
    )
)

# Load CPA educational rules and sample cases into the knowledge base
for educational_rule in build_educational_rules():
    kb.add_rule(educational_rule)
populate_sample_cases(kb)

@app.route("/api/logic-comparison", methods=["GET"])
def logic_comparison():
    return jsonify({
        "propositional_logic": {
            "representation": "ReportsDefect_Ramesh_Smartphone",
            "meaning": "A single statement treated as true or false.",
            "limitation": "The statement does not explicitly represent the consumer and product as separate arguments."
        },
        "first_order_logic": {
            "representation": "ReportsDefect(Ramesh, Smartphone_Model_Z)",
            "meaning": "A predicate represents a relationship between a consumer and a product.",
            "advantage": "Variables and quantified rules can express general relationships across different consumers and products."
        }
    })

@app.route("/api/explain", methods=["POST"])
def explain_query():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Send a JSON object."}), 400

    predicate_name = data.get("predicate")
    arguments = data.get("arguments")

    if not isinstance(predicate_name, str) or not predicate_name.strip():
        return jsonify({"error": "A predicate name is required."}), 400

    if not isinstance(arguments, list) or not all(
        isinstance(arg, str) and arg.strip()
        for arg in arguments
    ):
        return jsonify({
            "error": "Arguments must be a list of non-empty strings."
        }), 400

    goal = Predicate(
        predicate_name.strip(),
        [Constant(arg.strip()) for arg in arguments]
    )

    result = kb.explain(goal)
    return jsonify(result)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Consumer Rights Advisory System API is running"
    })

@app.route("/api/query", methods=["POST"])
def query_fact():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Send a JSON object."}), 400

    predicate_name = data.get("predicate")
    arguments = data.get("arguments")

    if not isinstance(predicate_name, str) or not predicate_name.strip():
        return jsonify({"error": "A predicate name is required."}), 400

    if not isinstance(arguments, list) or not arguments:
        return jsonify({
            "error": "Provide a non-empty arguments list."
        }), 400

    if not all(
        isinstance(arg, str) and arg.strip()
        for arg in arguments
    ):
        return jsonify({
            "error": "Every argument must be a non-empty string."
        }), 400

    goal = Predicate(
        predicate_name.strip(),
        [Constant(arg.strip()) for arg in arguments]
    )

    matches = kb.query(goal)

    return jsonify({
        "predicate": predicate_name.strip(),
        "arguments": [arg.strip() for arg in arguments],
        "proved": bool(matches),
        "explanation": (
            "The knowledge base derived or matched this fact."
            if matches
            else "The knowledge base could not prove this fact."
        )
    })


@app.route("/api/resolve", methods=["POST"])
def resolve_query():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Send a JSON object."}), 400

    predicate_name = data.get("predicate")
    arguments = data.get("arguments")

    if not isinstance(predicate_name, str) or not predicate_name.strip():
        return jsonify({"error": "A predicate name is required."}), 400

    if not isinstance(arguments, list) or not arguments:
        return jsonify({
            "error": "Provide a non-empty arguments list."
        }), 400

    if not all(
        isinstance(arg, str) and arg.strip()
        for arg in arguments
    ):
        return jsonify({
            "error": "Every argument must be a non-empty string."
        }), 400

    goal = Predicate(
        predicate_name.strip(),
        [Constant(arg.strip()) for arg in arguments]
    )

    try:
        proved = kb.prove_by_resolution(goal)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({
        "predicate": predicate_name.strip(),
        "arguments": [arg.strip() for arg in arguments],
        "proved": bool(proved),
        "method": "resolution_by_contradiction",
        "explanation": (
            "Contradiction derived: The negated goal produced an empty clause {}."
            if proved
            else "Resolution completed without deriving a contradiction."
        )
    })



@app.route("/api/kb", methods=["GET"])
def get_knowledge_base():
    facts_list = [repr(f) for f in kb.facts]
    rules_list = [
        {
            "head": repr(r.head),
            "body": [repr(b) for b in r.body],
            "comment": r.comment or "",
        }
        for r in kb.rules
    ]
    return jsonify({
        "name": kb.name,
        "facts_count": len(facts_list),
        "rules_count": len(rules_list),
        "facts": facts_list,
        "rules": rules_list,
    })


@app.route("/api/cases", methods=["GET"])
def get_cases():
    cases_data = [
        {
            "id": "case_ramesh",
            "title": "Case 1: Ramesh vs. TechMart India",
            "tag": "Allegation Stage (Section 35)",
            "consumer": "Ramesh",
            "goods": "Smartphone_Model_Z",
            "seller": "TechMart_India",
            "issue": "Battery Overheating",
            "problem": "Ramesh bought a Smartphone Model Z for Rs 18,000 from TechMart India. Within two weeks, the battery overheated dangerously during normal charging. TechMart India refused replacement, claiming normal heating.",
            "what_matters": "Ramesh has a valid invoice and consideration (qualifies as a consumer under Section 2(7)). His claim is an allegation under Section 35, giving him standing to file a complaint. However, an allegation is not automatic proof of liability; statutory relief under Section 39 requires inquiry or lab testing under Section 38(2)(c).",
            "possible_options": "Ramesh can file a complaint with the District Consumer Commission and request accredited laboratory testing. If the defect is confirmed, he can seek replacement, repair, or full refund plus compensation. He can also seek informal conciliation via NCH 1915.",
            "next_steps": [
                "Preserve original invoice, phone, charger, and chat records.",
                "Serve 15-day written notice to TechMart India.",
                "Lodge grievance on National Consumer Helpline (NCH 1915).",
                "File petition on e-Daakhil for District Commission inquiry."
            ]
        },
        {
            "id": "case_priya",
            "title": "Case 2: Priya vs. PureWater Solutions",
            "tag": "Adjudicated Finding (Section 38 & 39)",
            "consumer": "Priya",
            "goods": "AquaPure_RO_System",
            "seller": "PureWater_Solutions",
            "issue": "Contaminated Water / Defective Filter",
            "problem": "Priya purchased a water purifier that dispensed yellowish, smelly water. The seller denied any defect. The District Consumer Commission admitted the complaint and ordered government laboratory testing.",
            "what_matters": "The government laboratory report formally confirmed a manufacturing membrane defect. This converted Priya's unilateral allegation into an established judicial finding of defect under Section 38.",
            "possible_options": "Because a formal defect finding was recorded, Priya is eligible for statutory relief under Section 39. The Commission ordered full replacement of the unit. Priya is also entitled to claim litigation expenses.",
            "next_steps": [
                "Place accredited test report on official court record.",
                "Petition Commission for formal replacement or refund order.",
                "File execution proceedings under Section 71/72 if company fails to comply within 30 days."
            ]
        },
        {
            "id": "case_apex",
            "title": "Case 3: Apex Logistics vs. SpeedMotors Ltd",
            "tag": "Commercial Exclusion (Section 2(7))",
            "consumer": "Apex_Logistics_Pvt_Ltd",
            "goods": "Commercial_Fleet_Vans",
            "seller": "SpeedMotors_Ltd",
            "issue": "Fleet Brake Wear",
            "problem": "Apex Logistics bought 10 delivery vans for commercial freight operations and alleged premature brake wear. SpeedMotors contended the buyer is not a consumer under CPA 2019.",
            "what_matters": "Under Section 2(7), purchasing goods for a commercial purpose or business resale excludes the buyer from Consumer Commission jurisdiction, unless the purchase was made exclusively for personal livelihood by self-employment.",
            "possible_options": "Apex Logistics cannot seek remedies in Consumer Court. They must pursue commercial breach of contract or warranty remedies in Commercial Civil Courts or through arbitration.",
            "next_steps": [
                "Review commercial supply contract and warranty clauses.",
                "Issue legal notice under Sale of Goods Act, 1930 / Indian Contract Act.",
                "File in Commercial Civil Court or initiate arbitration."
            ]
        },
        {
            "id": "case_vikram",
            "title": "Case 4: Vikram vs. AutoDrive Dealership",
            "tag": "Claim Dismissed / Mishandling (Section 38)",
            "consumer": "Vikram",
            "goods": "CitySedan_V6",
            "seller": "AutoDrive_Dealership",
            "issue": "Engine Knocking Dispute",
            "problem": "Vikram claimed engine knocking and demanded engine replacement under warranty. The dealer refused, alleging Vikram used adulterated fuel and skipped maintenance.",
            "what_matters": "The Commission ordered technical inspection. The report confirmed improper fuel usage and consumer mishandling, not an inherent manufacturing defect. The Commission entered a finding of no defect.",
            "possible_options": "Statutory warranty relief under Section 39 is legally barred when vehicle failure is proven to be caused by consumer negligence or misuse.",
            "next_steps": [
                "Maintain complete manufacturer service records and fuel receipts.",
                "Seek an independent diagnostic report before approaching court if falsely accused of misuse."
            ]
        }
    ]
    return jsonify({"cases": cases_data})


@app.route("/api/advisory", methods=["POST"])
def consumer_advisory():
    data = request.get_json(silent=True) or {}

    category = data.get("category", "defective_product").strip().lower()
    description = (data.get("description") or "").strip()

    # User answers to key questions
    has_invoice = data.get("has_invoice")  # True / False / None
    seller_notified = data.get("seller_notified")  # True / False / None
    commercial_purpose = bool(data.get("commercial_purpose", False))
    inspection_report = bool(data.get("inspection_report", False))

    raw_consumer = (data.get("consumer_name") or "Consumer").strip()
    raw_goods = (data.get("goods_name") or "Reported Item").strip()
    raw_seller = (data.get("seller_name") or "Merchant").strip()

    # Normalize entity names for logic engine constants
    clean_consumer = "".join(ch if ch.isalnum() else "_" for ch in raw_consumer).strip("_") or "Consumer"
    clean_goods = "".join(ch if ch.isalnum() else "_" for ch in raw_goods).strip("_") or "Reported_Item"
    clean_seller = "".join(ch if ch.isalnum() else "_" for ch in raw_seller).strip("_") or "Merchant"

    # Create dedicated evaluation KB with CPA Horn rules
    case_kb = KnowledgeBase(name="AdvisoryCaseEvaluation")
    for rule in build_educational_rules():
        case_kb.add_rule(rule)

    c = Constant(clean_consumer)
    g = Constant(clean_goods)
    s = Constant(clean_seller)
    issue_const = Constant("ReportedIssue")
    comm = Constant("ConsumerCommission")

    # Assert factual basis
    case_kb.add_fact(Predicate(PRED_PURCHASED, [c, g, s]))

    if has_invoice is not False:
        case_kb.add_fact(Predicate(PRED_PAID_CONSIDERATION, [c, g]))

    if commercial_purpose:
        case_kb.add_fact(Predicate(PRED_COMMERCIAL_PURPOSE, [c, g]))

    if category == "refund_problem":
        case_kb.add_fact(Predicate(PRED_ALLEGES_REFUND_DENIAL, [c, g, issue_const]))
    elif category == "delivery_issue":
        case_kb.add_fact(Predicate(PRED_ALLEGES_DELIVERY_FAILURE, [c, g, issue_const]))
    elif category == "warranty_denied":
        case_kb.add_fact(Predicate(PRED_ALLEGES_WARRANTY_DENIAL, [c, g, issue_const]))
    else:
        category = "defective_product"
        case_kb.add_fact(Predicate(PRED_ALLEGES_DEFECT, [c, g, issue_const]))

    if inspection_report:
        case_kb.add_fact(Predicate(PRED_COMMISSION_FINDING_DEFECT, [comm, g, issue_const]))

    # Run First-Order Logic explanations
    goal_consumer = Predicate(PRED_IS_CONSUMER, [c, g])
    res_consumer = case_kb.explain(goal_consumer)
    is_consumer_proved = bool(res_consumer.get("proved"))

    goal_maintainable = Predicate(PRED_MAINTAINABLE_COMPLAINT, [c, s, g])
    res_maintainable = case_kb.explain(goal_maintainable)
    maintainable_proved = bool(res_maintainable.get("proved"))

    goal_relief = Predicate(PRED_ELIGIBLE_FOR_RELIEF_CONSIDERATION, [c, g])
    res_relief = case_kb.explain(goal_relief)
    relief_proved = bool(res_relief.get("proved"))

    goal_commercial = Predicate(PRED_EXCLUDED_COMMERCIAL, [c, g])
    res_commercial = case_kb.explain(goal_commercial)
    commercial_proved = bool(res_commercial.get("proved"))

    situation_text = ""
    what_you_can_do = []
    next_steps = []
    keep_documents = []
    missing_info = []

    # Follow-up questions when essential info is missing
    if has_invoice is None:
        missing_info.append({
            "key": "has_invoice",
            "question": "Do you have the tax invoice, cash memo, or bank/UPI transaction receipt?",
            "options": ["Yes, I have it", "No / Lost receipt"]
        })
    if seller_notified is None:
        missing_info.append({
            "key": "seller_notified",
            "question": "Have you already notified the seller or brand in writing (email/chat/ticket)?",
            "options": ["Yes, already notified", "Not yet"]
        })

    # Situation statement
    if commercial_proved:
        situation_text = (
            f"You reported purchasing {raw_goods} from {raw_seller} for business or fleet use. "
            "Under Section 2(7) of the Consumer Protection Act, 2019, commercial purchases are statutorily excluded from Consumer Commission jurisdiction unless made solely for personal livelihood via self-employment."
        )
        what_you_can_do = [
            "Assess self-employment exception: If you are an individual and the item is used solely to earn your livelihood through personal work, you may still qualify as a consumer under Section 2(7).",
            "Commercial contract remedies: If purchased for an enterprise or fleet, your legal remedies lie in Commercial Civil Courts under the Sale of Goods Act, 1930 and Indian Contract Act, 1872.",
            "Arbitration / Mediation: Check your commercial purchase contract for mandatory arbitration or dispute resolution clauses."
        ]
        next_steps = [
            "Review your purchase contract and warranty terms for dispute resolution clauses.",
            "If claiming self-employment, gather tax returns and an affidavit proving single-person operation for livelihood.",
            "Serve a formal legal notice of breach of warranty under the Indian Contract Act giving 15–30 days to resolve.",
            "File a commercial suit in the appropriate Commercial Civil Court or initiate arbitration."
        ]
        keep_documents = [
            "Commercial purchase order / supply contract / tax invoice",
            "Payment receipts and bank statement records",
            "Written notices of defect or breach sent to the supplier",
            "Maintenance logs and technician reports"
        ]
    elif has_invoice is False:
        situation_text = (
            f"You reported an issue regarding {raw_goods} from {raw_seller}, but noted you do not have a purchase invoice or receipt. "
            "Under Section 2(7) of CPA 2019, establishing consumer standing requires proof that consideration was paid or promised."
        )
        what_you_can_do = [
            "Request duplicate bill: Under consumer regulations, merchants and e-commerce platforms are obligated to provide duplicate invoices upon request.",
            "Use bank or UPI proof: A bank account debit statement, credit card slip, or UPI transaction ID serves as secondary documentary proof of consideration.",
            "Consumer standing: Once payment proof is established, your statutory rights under CPA 2019 become fully enforceable."
        ]
        next_steps = [
            "Contact the seller, marketplace, or store to request a duplicate tax invoice or order confirmation.",
            "Download your bank statement or UPI transaction receipt showing the exact debit amount and merchant name.",
            "Once invoice or payment proof is located, proceed with a formal written notice to the merchant."
        ]
        keep_documents = [
            "Bank or card account statement showing the transaction",
            "UPI reference number and screenshot",
            "Delivery package label or SMS/email order confirmation showing order ID"
        ]
    else:
        # Standard consumer situations
        if category == "defective_product":
            situation_text = (
                f"You reported that {raw_goods} purchased from {raw_seller} has a functional or manufacturing defect. "
                "At this stage, this represents a consumer-alleged defect under Section 35 of the Consumer Protection Act, 2019, and is not yet an established judicial finding."
            )
            what_you_can_do = [
                "Right to file complaint: Under Section 35 of CPA 2019, you have standing to initiate an inquiry against the merchant and manufacturer.",
                "Statutory laboratory testing: Under Section 38(2)(c), if the merchant denies the defect, the Consumer Commission can order an accredited government laboratory to test the product.",
                "Remedies upon proven defect: Under Section 39, upon establishing a defect, the Commission can order free repair, replacement with a new unit, or a full refund plus compensation.",
                "Important distinction: Relief is granted upon proof or settlement; merely alleging a defect does not guarantee an immediate automatic refund."
            ]
            next_steps = [
                "Preserve the defective product in its current state; avoid third-party repairs that could void your claim.",
                "Send a formal written 15-day notice to the seller and manufacturer requesting replacement or repair.",
                "Register a grievance on the National Consumer Helpline (NCH 1915 or consumerhelpline.gov.in) for informal conciliation.",
                "If unresolved, file a complaint before the District Consumer Commission online via e-Daakhil (edaakhil.nic.in)."
            ]
            keep_documents = [
                "Tax invoice or cash memo",
                "Warranty card or manufacturer guarantee booklet",
                "Photographs or video demonstrating the defect in operation",
                "Written correspondence (emails, support tickets, chat logs)",
                "Authorized service center job sheet or rejection slip (if visited)"
            ]
        elif category == "refund_problem":
            situation_text = (
                f"You reported that {raw_seller} has refused or delayed a refund for {raw_goods} after a return, cancellation, or failed fulfillment. "
                "Under Indian law, this is an alleged unfair trade practice and deficiency in service, currently pending resolution."
            )
            what_you_can_do = [
                "Unfair Trade Practice protection: Under Section 2(47) of CPA 2019 and E-Commerce Rules 2020, refusing or unreasonably delaying legitimate refunds is an unfair trade practice.",
                "Right to full refund with interest: You are entitled to demand a 100% refund of the amount paid, plus statutory interest for the delay period.",
                "Chargeback / bank dispute: If you paid via credit card or UPI, you can raise an official transaction dispute with your issuing bank.",
                "Relief under Section 39: The Consumer Commission can order immediate refund disbursement along with compensation for harassment and financial loss."
            ]
            next_steps = [
                "Gather your return pickup receipt, courier tracking screenshot, or cancellation confirmation.",
                "Send a final written demand to the seller and payment gateway with transaction IDs, giving 7 days to disburse the refund.",
                "Lodge a grievance on the National Consumer Helpline (call 1915 or visit consumerhelpline.gov.in).",
                "File a petition for refund with interest before the District Consumer Commission via e-Daakhil."
            ]
            keep_documents = [
                "Order invoice and proof of payment (UPI/bank statement)",
                "Proof of return (courier pickup slip or tracking status)",
                "Order cancellation confirmation screenshot",
                "Written emails or chat logs with customer support requesting refund"
            ]
        elif category == "delivery_issue":
            situation_text = (
                f"You reported that {raw_goods} ordered from {raw_seller} was not delivered, severely delayed, or delivered as a wrong item. "
                "Under consumer law, this is a reported delivery failure and alleged deficiency of service."
            )
            what_you_can_do = [
                "Deficiency in service: Failure to deliver goods within promised timelines or delivering incorrect items constitutes a deficiency of service under Section 2(11).",
                "Right to cancel or demand fulfillment: You have the right to either cancel the order for an immediate 100% refund or demand delivery of the correct genuine item.",
                "E-Commerce Rules protection: Platforms cannot unilaterally cancel confirmed orders without valid reason and must provide delivery tracking.",
                "Compensation for delay: You can seek compensation under Section 39 for mental agony, loss of time, and consequential damages caused by non-delivery."
            ]
            next_steps = [
                "Take screenshots of the order page showing agreed delivery date and courier tracking history.",
                "If a wrong parcel was delivered, retain all outer packaging and take clear photos/video of the received item and shipping label.",
                "Send written notice to the seller giving 48 to 72 hours to deliver the correct product or refund.",
                "Register a complaint on the National Consumer Helpline (NCH 1915).",
                "File on e-Daakhil if the merchant fails to provide the product or refund."
            ]
            keep_documents = [
                "Order confirmation and payment invoice",
                "Courier tracking timeline and screenshots",
                "Photos/videos of the package and wrong item received (or uncut unboxing video)",
                "Written messages sent to customer care"
            ]
        elif category == "warranty_denied":
            situation_text = (
                f"You reported that {raw_seller} or its service center denied warranty coverage for {raw_goods}, alleging customer misuse or damage. "
                "This is a disputed warranty claim where the merchant's denial has not been judicially verified."
            )
            what_you_can_do = [
                "Challenge arbitrary denial: Under Section 2(11) of CPA 2019, arbitrary warranty rejection without technical proof is a deficiency in service.",
                "Burden of proof on merchant: Under Section 38, the merchant cannot void a warranty merely by alleging customer negligence; they must provide credible technical inspection proof.",
                "Right to diagnostic logs: You have the right to demand the service center's formal job sheet, technician diagnostic logs, and inspection photographs.",
                "Commission independent inspection: You can petition the Commission under Section 38(2)(c) to appoint an independent certified expert to examine the item."
            ]
            next_steps = [
                "Demand a formal written job sheet from the service center explicitly stating the technical reason warranty was denied.",
                "Collect all manufacturer service records and purchase receipts to demonstrate proper maintenance.",
                "Send a written escalation notice to the brand's Grievance Officer challenging the technician's findings.",
                "Lodge an NCH complaint (1915), which frequently results in brand reconsideration for warranty disputes.",
                "File on e-Daakhil requesting an independent technical inspection under Section 38."
            ]
            keep_documents = [
                "Purchase invoice and warranty card",
                "Authorized service center job sheet or estimate showing denied warranty",
                "Photos of the item showing its cosmetic condition and serial/IMEI number",
                "Written email exchanges with the brand or service center"
            ]

    # Official grievance channels
    official_channels = [
        {
            "name": "National Consumer Helpline (NCH)",
            "phone": "1915 (Toll-Free, 8 AM – 8 PM)",
            "url": "https://consumerhelpline.gov.in",
            "description": "Free central government grievance portal for fast informal conciliation with partner brands."
        },
        {
            "name": "e-Daakhil Portal",
            "url": "https://edaakhil.nic.in",
            "description": "Official online portal to file legal cases before District, State, or National Consumer Commissions without hiring a lawyer."
        },
        {
            "name": "INGRAM Portal",
            "url": "https://ingram.gov.in",
            "description": "Integrated Grievance Redressal Mechanism monitored by the Ministry of Consumer Affairs."
        }
    ]

    return jsonify({
        "category": category,
        "situation": situation_text,
        "what_you_can_do": what_you_can_do,
        "next_steps": next_steps,
        "keep_documents": keep_documents,
        "official_channels": official_channels,
        "logic_proof": {
            "goal": repr(goal_maintainable),
            "proved": maintainable_proved,
            "is_consumer_proved": is_consumer_proved,
            "relief_proved": relief_proved,
            "commercial_excluded": commercial_proved,
            "applied_rules": res_maintainable.get("applied_rules", []),
            "supporting_facts": res_maintainable.get("supporting_facts", []),
            "method": "First-Order Horn Clause Deduction & Robinson Unification",
        },
        "limitations": (
            "First-Order Logic engine verifies statutory complaint maintainability (standing under CPA 2019 Section 35). "
            "Statutory remedies under Section 39 (refund, replacement, or damages) are discretionary judicial decisions granted only upon formal Commission inquiry or conciliation. "
            "The system cannot predict court awards or guarantee financial recovery."
        ),
        "follow_up_questions": missing_info,
    })


if __name__ == "__main__":
    app.run(debug=True)
