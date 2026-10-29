"""
Consumer Protection Knowledge Base (Indian Law Reference Domain)
================================================================

LEGAL & ACADEMIC DISCLAIMER:
----------------------------
This knowledge base is a simplified educational representation created strictly
for a college First-Order Logic AI assignment. It does NOT constitute legal advice.
In actual practice under the Consumer Protection Act, 2019 (CPA 2019):
1. An allegation made in a complaint is NOT proof of liability.
2. A Consumer Commission (District, State, or National) must follow statutory
   adjudication procedures (Section 38), which often involve laboratory testing
   under Section 38(2)(c).
3. Relief under Section 39 (such as repair, replacement, refund, or compensation)
   is a discretionary judicial order granted only upon formal findings.
   A consumer NEVER automatically qualifies for a refund simply by alleging a defect.

PREDICATE DESIGN & TAXONOMY:
----------------------------
To adhere to proper legal distinction, predicates are partitioned into three classes:

1. Transactional & Procedural Facts:
   - purchased(Consumer, Goods, Seller)
   - paid_consideration(Consumer, Goods)
   - commercial_purpose(Consumer, Goods)
   - complaint_admitted(Commission, CaseID, Consumer, Seller)
   - lab_analysis_ordered(Commission, Goods)
   - lab_report_confirms_defect(Goods, DefectType)

2. Subjective Allegations (Unilateral Claims by Parties):
   - alleges_defect(Consumer, Goods, AllegedDefect)
   - opposite_party_denies(Seller, AllegedDefect)

3. Adjudicated Commission Findings (Judicial Determinations):
   - commission_finding_defect(Commission, Goods, DefectType)
   - commission_finding_no_defect(Commission, Goods, Reason)
   - commission_ordered_relief(Commission, Consumer, Seller, ReliefType)
"""

import sys
from pathlib import Path
from typing import List

# Ensure project root is in sys.path so the file can be run directly or as a package
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.logic_engine import (
    Variable,
    Constant,
    Predicate,
    Rule,
    KnowledgeBase,
)


# ============================================================================
# 1. PREDICATE SYMBOL CONSTANTS (For Consistency and Readability)
# ============================================================================

# Transactional Predicates
PRED_PURCHASED = "purchased"
PRED_PAID_CONSIDERATION = "paid_consideration"
PRED_COMMERCIAL_PURPOSE = "commercial_purpose"

# Allegations (Subjective claims, Section 35)
PRED_ALLEGES_DEFECT = "alleges_defect"
PRED_ALLEGES_REFUND_DENIAL = "alleges_refund_denial"
PRED_ALLEGES_DELIVERY_FAILURE = "alleges_delivery_failure"
PRED_ALLEGES_WARRANTY_DENIAL = "alleges_warranty_denial"
PRED_OPPOSITE_PARTY_DENIES = "opposite_party_denies"

# Procedural / Evidence (Section 38)
PRED_COMPLAINT_ADMITTED = "complaint_admitted"
PRED_LAB_ANALYSIS_ORDERED = "lab_analysis_ordered"
PRED_LAB_REPORT_CONFIRMS_DEFECT = "lab_report_confirms_defect"

# Adjudicated Commission Findings (Section 38 & 39)
PRED_COMMISSION_FINDING_DEFECT = "commission_finding_defect"
PRED_COMMISSION_FINDING_NO_DEFECT = "commission_finding_no_defect"
PRED_COMMISSION_ORDERED_RELIEF = "commission_ordered_relief"

# Derived Legal Statuses (Educational Horn Rules)
PRED_IS_CONSUMER = "is_consumer"
PRED_MAINTAINABLE_COMPLAINT = "maintainable_complaint"
PRED_ELIGIBLE_FOR_RELIEF_CONSIDERATION = "eligible_for_relief_consideration"
PRED_EXCLUDED_COMMERCIAL = "excluded_commercial_purchase"


# ============================================================================
# 2. SIMPLIFIED EDUCATIONAL RULES (First-Order Horn Clauses)
# ============================================================================

def build_educational_rules() -> List[Rule]:
    """
    Constructs simplified educational Horn rules for consumer law concepts.

    Every rule is heavily annotated to clarify that these are educational
    approximations, not automatic statutory conclusions.
    """
    rules: List[Rule] = []

    # Common variables
    c = Variable("Consumer")
    g = Variable("Goods")
    s = Variable("Seller")
    d = Variable("Defect")
    comm = Variable("Commission")

    # -------------------------------------------------------------------------
    # Rule 1: Consumer Qualification (Simplified Sec 2(7), CPA 2019)
    # A person qualifies prima facie as a consumer if they purchased goods for
    # consideration. (Note: Commercial purchasers are excluded in actual law,
    # unless exclusively for self-employment livelihood).
    # -------------------------------------------------------------------------
    r1 = Rule(
        head=Predicate(PRED_IS_CONSUMER, [c, g]),
        body=[
            Predicate(PRED_PURCHASED, [c, g, s]),
            Predicate(PRED_PAID_CONSIDERATION, [c, g]),
        ],
        comment=(
            "Educational Rule (Sec 2(7)): A person is prima facie a consumer for goods "
            "if they purchased them for consideration from a seller."
        )
    )
    rules.append(r1)

    # -------------------------------------------------------------------------
    # Rule 2: Maintainability of Complaint for Inquiry (Sec 35, CPA 2019)
    # A consumer who alleges a defect in goods bought from a seller has standing
    # to submit a complaint for examination before the Commission.
    # NOTE: Maintainability does NOT mean the complaint is won!
    # -------------------------------------------------------------------------
    r2 = Rule(
        head=Predicate(PRED_MAINTAINABLE_COMPLAINT, [c, s, g]),
        body=[
            Predicate(PRED_IS_CONSUMER, [c, g]),
            Predicate(PRED_ALLEGES_DEFECT, [c, g, d]),
            Predicate(PRED_PURCHASED, [c, g, s]),
        ],
        comment=(
            "Educational Rule (Sec 35): A complaint alleging defect is maintainable "
            "for inquiry if filed by a qualifying consumer against the seller. "
            "This only initiates proceedings; it does NOT establish liability."
        )
    )
    rules.append(r2)

    # -------------------------------------------------------------------------
    # Rule 3: Procedural Necessity of Commission Finding (Sec 38 / 39, CPA 2019)
    # A complainant becomes eligible for remedial consideration ONLY AFTER
    # the Commission enters a formal finding of defect (not merely on allegation).
    # -------------------------------------------------------------------------
    r3 = Rule(
        head=Predicate(PRED_ELIGIBLE_FOR_RELIEF_CONSIDERATION, [c, g]),
        body=[
            Predicate(PRED_IS_CONSUMER, [c, g]),
            Predicate(PRED_COMMISSION_FINDING_DEFECT, [comm, g, d]),
        ],
        comment=(
            "Educational Rule (Sec 38/39): Remedial adjudication requires an established "
            "commission finding of defect. An allegation alone is legally insufficient."
        )
    )
    rules.append(r3)

    # -------------------------------------------------------------------------
    # Rule 4: Maintainability for Refund Refusal / Delay (Sec 2(47), CPA 2019)
    # Refusing or delaying refund within promised or statutory timeframe.
    # -------------------------------------------------------------------------
    r4 = Rule(
        head=Predicate(PRED_MAINTAINABLE_COMPLAINT, [c, s, g]),
        body=[
            Predicate(PRED_IS_CONSUMER, [c, g]),
            Predicate(PRED_ALLEGES_REFUND_DENIAL, [c, g, d]),
            Predicate(PRED_PURCHASED, [c, g, s]),
        ],
        comment=(
            "Educational Rule (Sec 2(47)): Unfair trade practice complaint for refund denial "
            "is maintainable for inquiry when filed by a qualifying consumer."
        )
    )
    rules.append(r4)

    # -------------------------------------------------------------------------
    # Rule 5: Maintainability for Delivery Failure (Sec 2(11), CPA 2019)
    # Non-delivery or severe delay after accepting purchase consideration.
    # -------------------------------------------------------------------------
    r5 = Rule(
        head=Predicate(PRED_MAINTAINABLE_COMPLAINT, [c, s, g]),
        body=[
            Predicate(PRED_IS_CONSUMER, [c, g]),
            Predicate(PRED_ALLEGES_DELIVERY_FAILURE, [c, g, d]),
            Predicate(PRED_PURCHASED, [c, g, s]),
        ],
        comment=(
            "Educational Rule (Sec 2(11)): Deficiency in service complaint for delivery failure "
            "is maintainable for inquiry when filed by a qualifying consumer."
        )
    )
    rules.append(r5)

    # -------------------------------------------------------------------------
    # Rule 6: Maintainability for Warranty Denial (Sec 2(11) & Sec 38, CPA 2019)
    # Arbitrary warranty refusal or unsubstantiated customer blame.
    # -------------------------------------------------------------------------
    r6 = Rule(
        head=Predicate(PRED_MAINTAINABLE_COMPLAINT, [c, s, g]),
        body=[
            Predicate(PRED_IS_CONSUMER, [c, g]),
            Predicate(PRED_ALLEGES_WARRANTY_DENIAL, [c, g, d]),
            Predicate(PRED_PURCHASED, [c, g, s]),
        ],
        comment=(
            "Educational Rule (Sec 2(11) & Sec 38): Warranty dispute complaint is maintainable "
            "for inquiry. The seller bears burden of substantiating customer misuse."
        )
    )
    rules.append(r6)

    # -------------------------------------------------------------------------
    # Rule 7: Commercial Purpose Exclusion (Sec 2(7), CPA 2019)
    # Excludes goods acquired for commercial resale or business profit.
    # -------------------------------------------------------------------------
    r7 = Rule(
        head=Predicate(PRED_EXCLUDED_COMMERCIAL, [c, g]),
        body=[
            Predicate(PRED_PURCHASED, [c, g, s]),
            Predicate(PRED_COMMERCIAL_PURPOSE, [c, g]),
        ],
        comment=(
            "Educational Rule (Sec 2(7)): Purchases for commercial purpose are statutorily "
            "excluded from consumer commission jurisdiction (unless self-employment exception)."
        )
    )
    rules.append(r7)

    return rules


# ============================================================================
# 3. SAMPLE EDUCATIONAL CASE SCENARIOS
# ============================================================================

def populate_sample_cases(kb: KnowledgeBase) -> None:
    """
    Populates the KnowledgeBase with concrete, realistic educational case studies
    demonstrating the crucial difference between allegations and findings.
    """

    # -------------------------------------------------------------------------
    # CASE 1: Ramesh vs TechMart India (Allegation Stage Only)
    # Status: Ramesh bought a smartphone and alleges severe battery heating.
    # Procedural state: Complaint filed, but Commission inquiry is pending.
    # Commission has NOT made any finding yet.
    # Key AI Point: Queries for 'commission_finding_defect' will return NO matches!
    # -------------------------------------------------------------------------
    ramesh = Constant("Ramesh")
    phone = Constant("Smartphone_Model_Z")
    techmart = Constant("TechMart_India")
    heating_defect = Constant("Battery_Overheating_Issue")

    kb.add_fact(Predicate(PRED_PURCHASED, [ramesh, phone, techmart]))
    kb.add_fact(Predicate(PRED_PAID_CONSIDERATION, [ramesh, phone]))
    kb.add_fact(Predicate(PRED_ALLEGES_DEFECT, [ramesh, phone, heating_defect]))
    kb.add_fact(Predicate(PRED_OPPOSITE_PARTY_DENIES, [techmart, heating_defect]))

    # -------------------------------------------------------------------------
    # CASE 2: Priya vs PureWater Solutions (Adjudicated Defect Case)
    # Status: Water purifier delivered contaminated water. Commission sent sample
    # to Government Testing Laboratory (Sec 38(2)(c)). Lab report confirmed
    # defective membrane. Commission formally recorded a finding of defect.
    # -------------------------------------------------------------------------
    priya = Constant("Priya")
    purifier = Constant("AquaPure_RO_System")
    water_co = Constant("PureWater_Solutions")
    filtration_defect = Constant("Contaminated_Filtration_Defect")
    dcdrc_delhi = Constant("District_Commission_Delhi")

    kb.add_fact(Predicate(PRED_PURCHASED, [priya, purifier, water_co]))
    kb.add_fact(Predicate(PRED_PAID_CONSIDERATION, [priya, purifier]))
    kb.add_fact(Predicate(PRED_ALLEGES_DEFECT, [priya, purifier, filtration_defect]))
    kb.add_fact(Predicate(PRED_COMPLAINT_ADMITTED, [dcdrc_delhi, Constant("Case_2023_101"), priya, water_co]))
    kb.add_fact(Predicate(PRED_LAB_ANALYSIS_ORDERED, [dcdrc_delhi, purifier]))
    kb.add_fact(Predicate(PRED_LAB_REPORT_CONFIRMS_DEFECT, [purifier, filtration_defect]))

    # Formal judicial finding (Section 38 conclusion):
    kb.add_fact(Predicate(PRED_COMMISSION_FINDING_DEFECT, [dcdrc_delhi, purifier, filtration_defect]))

    # Commission discretionary order under Section 39 (remedy ordered after finding):
    kb.add_fact(Predicate(PRED_COMMISSION_ORDERED_RELIEF, [dcdrc_delhi, priya, water_co, Constant("Replace_Purifier_Unit")]))

    # -------------------------------------------------------------------------
    # CASE 3: Apex Logistics vs SpeedMotors Ltd (Commercial Purchase Exclusion)
    # Status: Apex Logistics bought 10 delivery vans for commercial fleet operation.
    # Section 2(7) excludes goods bought for commercial purpose.
    # -------------------------------------------------------------------------
    apex_corp = Constant("Apex_Logistics_Pvt_Ltd")
    vans = Constant("Commercial_Fleet_Vans")
    motors = Constant("SpeedMotors_Ltd")
    brake_defect = Constant("Brake_Wear_Defect")

    kb.add_fact(Predicate(PRED_PURCHASED, [apex_corp, vans, motors]))
    kb.add_fact(Predicate(PRED_PAID_CONSIDERATION, [apex_corp, vans]))
    kb.add_fact(Predicate(PRED_COMMERCIAL_PURPOSE, [apex_corp, vans]))
    kb.add_fact(Predicate(PRED_ALLEGES_DEFECT, [apex_corp, vans, brake_defect]))

    # -------------------------------------------------------------------------
    # CASE 4: Vikram vs AutoDrive Dealership (Dismissed - No Defect Found)
    # Status: Vikram alleged engine defect. Commission lab report proved no
    # manufacturing defect; vehicle was damaged due to consumer negligence.
    # Commission issued finding of NO defect.
    # -------------------------------------------------------------------------
    vikram = Constant("Vikram")
    car = Constant("CitySedan_V6")
    autodrive = Constant("AutoDrive_Dealership")
    engine_issue = Constant("Alleged_Engine_Knocking")
    dcdrc_bangalore = Constant("District_Commission_Bengaluru")

    kb.add_fact(Predicate(PRED_PURCHASED, [vikram, car, autodrive]))
    kb.add_fact(Predicate(PRED_PAID_CONSIDERATION, [vikram, car]))
    kb.add_fact(Predicate(PRED_ALLEGES_DEFECT, [vikram, car, engine_issue]))
    kb.add_fact(Predicate(PRED_COMPLAINT_ADMITTED, [dcdrc_bangalore, Constant("Case_2023_205"), vikram, autodrive]))

    # Commission formal finding: NO DEFECT
    kb.add_fact(Predicate(PRED_COMMISSION_FINDING_NO_DEFECT, [dcdrc_bangalore, car, Constant("Consumer_Mishandling")]))


# ============================================================================
# 4. KNOWLEDGE BASE INITIALIZER
# ============================================================================

def create_consumer_law_kb() -> KnowledgeBase:
    """
    Creates and populates the complete educational Consumer Protection KnowledgeBase.
    """
    kb = KnowledgeBase(name="IndianConsumerProtectionCPA2019_Educational")

    # Add educational rules
    for rule in build_educational_rules():
        kb.add_rule(rule)

    # Populate sample cases
    populate_sample_cases(kb)

    return kb


if __name__ == "__main__":
    # Self-demonstration when run directly
    kb = create_consumer_law_kb()
    print("=" * 70)
    print("Consumer Rights & Entitlement Advisory System - Knowledge Base")
    print("=" * 70)
    print(f"Total asserted facts: {len(kb.facts)}")
    print(f"Total educational rules: {len(kb.rules)}")
    print("\nSample Asserted Facts:")
    for fact in kb.facts[:6]:
        print(f"  + {fact}")
    print("\nEducational Rules:")
    for rule in kb.rules:
        print(f"  * {rule}")
        print(f"    Note: {rule.comment}")
