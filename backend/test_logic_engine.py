"""
Unit Tests for First-Order Logic Engine & Consumer Protection Knowledge Base
=============================================================================

This test suite verifies:
1. Core FOL representations: Variables, Constants, Predicates, Rules.
2. Variable-to-constant matching and Robinson unification algorithms.
3. Substitution application, variable chaining, and occurs check.
4. The critical legal distinction between unilateral consumer allegations
   and formal Consumer Commission findings.
5. That no automatic refunds are assumed; educational rules are properly marked.

Run tests from the project root directory:
    python -m unittest backend/test_logic_engine.py
"""

import sys
import unittest
from pathlib import Path

# Ensure project root is in sys.path so the test can be run directly or via unittest runner
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.logic_engine import (
    clause_key,
    Clause,
    Literal,
    resolve,
    Variable,
    Constant,
    Predicate,
    Rule,
    apply_subst,
    unify,
    KnowledgeBase,
    rule_to_clause,
    standardize_clause_apart
)
from backend.knowledge_base import (
    create_consumer_law_kb,
    PRED_ALLEGES_DEFECT,
    PRED_COMMISSION_FINDING_DEFECT,
    PRED_COMMISSION_ORDERED_RELIEF,
    PRED_PURCHASED,
)


class TestTermsAndPredicates(unittest.TestCase):
    """Tests for First-Order Logic terms (Variables, Constants) and Predicates."""

    def test_variable_creation_and_naming(self):
        # A variable created without '?' automatically gets '?' prefixed
        var_x = Variable("x")
        self.assertEqual(var_x.name, "?x")
        self.assertEqual(repr(var_x), "?x")

        # Explicit '?' prefix is preserved
        var_consumer = Variable("?consumer")
        self.assertEqual(var_consumer.name, "?consumer")

        # Equality and hashing for variables
        self.assertEqual(Variable("x"), Variable("?x"))
        self.assertNotEqual(Variable("x"), Variable("y"))

    def test_constant_creation(self):
        c1 = Constant("Ramesh")
        c2 = Constant("Ramesh")
        c3 = Constant("LaptopX")

        self.assertEqual(c1.name, "Ramesh")
        self.assertEqual(c1, c2)
        self.assertNotEqual(c1, c3)
        self.assertEqual(repr(c1), "Ramesh")

    def test_predicate_properties(self):
        pred = Predicate(
            "alleges_defect",
            [Variable("c"), Constant("PhoneZ"), Variable("issue")]
        )
        self.assertEqual(pred.name, "alleges_defect")
        self.assertEqual(pred.arity, 3)
        self.assertFalse(pred.is_ground())

        # Ground predicate check (all arguments are constants)
        ground_pred = Predicate(
            "alleges_defect",
            [Constant("Ramesh"), Constant("PhoneZ"), Constant("BatteryHeat")]
        )
        self.assertTrue(ground_pred.is_ground())
        self.assertEqual(
            repr(ground_pred),
            "alleges_defect(Ramesh, PhoneZ, BatteryHeat)"
        )


class TestSubstitution(unittest.TestCase):
    """Tests for substitution application and dereferencing."""

    def test_empty_substitution(self):
        var = Variable("x")
        self.assertEqual(apply_subst({}, var), var)

    def test_apply_subst_variable_to_constant(self):
        var_x = Variable("x")
        const_val = Constant("Ramesh")
        subst = {var_x: const_val}

        result = apply_subst(subst, var_x)
        self.assertEqual(result, const_val)

    def test_apply_subst_to_predicate(self):
        var_c = Variable("c")
        var_d = Variable("d")
        pred = Predicate("alleges_defect", [var_c, Constant("LaptopX"), var_d])

        subst = {
            var_c: Constant("Priya"),
            var_d: Constant("ScreenFlicker"),
        }
        grounded = apply_subst(subst, pred)
        self.assertTrue(grounded.is_ground())
        self.assertEqual(grounded.args[0], Constant("Priya"))
        self.assertEqual(grounded.args[1], Constant("LaptopX"))
        self.assertEqual(grounded.args[2], Constant("ScreenFlicker"))

    def test_transitive_substitution_chain(self):
        # ?x -> ?y, and ?y -> Ramesh => apply_subst(?x) should resolve to Ramesh
        var_x = Variable("x")
        var_y = Variable("y")
        const_val = Constant("Ramesh")

        subst = {var_x: var_y, var_y: const_val}
        self.assertEqual(apply_subst(subst, var_x), const_val)


class TestUnification(unittest.TestCase):
    """
    Tests for Robinson's Unification Algorithm.
    Specifically tests variable-constant matching, variable-variable matching,
    predicate matching, and failure cases.
    """

    def test_variable_to_constant_unification(self):
        """Simple test case: matching a variable to a constant."""
        var_x = Variable("x")
        const_ramesh = Constant("Ramesh")

        # Case A: unify(Variable, Constant)
        mgu = unify(var_x, const_ramesh)
        self.assertIsNotNone(mgu, "Unification of variable and constant should succeed.")
        self.assertEqual(mgu[var_x], const_ramesh)

        # Case B: unify(Constant, Variable) (symmetric property)
        mgu_rev = unify(const_ramesh, var_x)
        self.assertIsNotNone(mgu_rev)
        self.assertEqual(mgu_rev[var_x], const_ramesh)

    def test_constant_to_constant_unification(self):
        c1 = Constant("LaptopX")
        c2 = Constant("LaptopX")
        c3 = Constant("PhoneZ")

        # Identical constants unify with empty substitution
        self.assertEqual(unify(c1, c2), {})

        # Distinct constants cannot unify
        self.assertIsNone(unify(c1, c3))

    def test_variable_to_variable_unification(self):
        var_x = Variable("x")
        var_y = Variable("y")

        mgu = unify(var_x, var_y)
        self.assertIsNotNone(mgu)
        # One variable is bound to the other
        self.assertTrue(mgu.get(var_x) == var_y or mgu.get(var_y) == var_x)

    def test_predicate_unification_success(self):
        # Pattern: alleges_defect(?consumer, LaptopX, ?defect)
        pattern = Predicate(
            "alleges_defect",
            [Variable("consumer"), Constant("LaptopX"), Variable("defect")]
        )
        # Fact: alleges_defect(Ramesh, LaptopX, ScreenFlicker)
        fact = Predicate(
            "alleges_defect",
            [Constant("Ramesh"), Constant("LaptopX"), Constant("ScreenFlicker")]
        )

        mgu = unify(pattern, fact)
        self.assertIsNotNone(mgu)
        self.assertEqual(mgu[Variable("consumer")], Constant("Ramesh"))
        self.assertEqual(mgu[Variable("defect")], Constant("ScreenFlicker"))

    def test_predicate_unification_name_or_arity_mismatch(self):
        p1 = Predicate("purchased", [Variable("x"), Constant("Item")])
        p2 = Predicate("alleges_defect", [Variable("x"), Constant("Item")])
        p3 = Predicate("purchased", [Variable("x"), Constant("Item"), Constant("Seller")])

        # Different predicate names cannot unify
        self.assertIsNone(unify(p1, p2))
        # Different arities cannot unify
        self.assertIsNone(unify(p1, p3))

    
    def test_occurs_check(self):
        var_x = Variable("x")

        # Unifying a variable with itself should succeed.
        self.assertEqual(unify(var_x, var_x), {})

        # x cannot unify with a compound term containing x.
        term = Predicate("Related", [var_x])

        self.assertIsNone(unify(var_x, term))


    def test_conflicting_constants_fail(self):
        result = unify(
            Predicate("purchased", [
                Variable("x"),
                Constant("Blender1")
            ]),
            Predicate("purchased", [
                Constant("Aman"),
                Constant("Phone1")
            ])
        )

        self.assertIsNone(result)
    def test_chained_substitution(self):
        x = Variable("x")
        y = Variable("y")
        ramesh = Constant("Ramesh")

        theta = {
            x: y,
            y: ramesh
        }
        result = apply_subst(theta, x)
        self.assertEqual(result, ramesh)
    
    def test_substitution_in_nested_predicate(self):
        x = Variable("x")
        ramesh = Constant("Ramesh")
        nested = Predicate(
            "has_right",
            [
                Predicate("consumer", [x])
            ]
        )

        theta = {x: ramesh}
        result = apply_subst(theta, nested)
        self.assertEqual(
            result.args[0].args[0],
            ramesh
        )
        
    def test_apply_subst_to_rule(self):
        x = Variable("x")
        ramesh = Constant("Ramesh")

        rule = Rule(
            Predicate("has_right", [x]),
            [Predicate("Consumer", [x])],
            "Test rule"
        )

        theta = {x: ramesh}
        result = apply_subst(theta, rule)

        self.assertEqual(
            result.head,
            Predicate("has_right", [ramesh])
        )
        self.assertEqual(
            result.body[0],
            Predicate("Consumer", [ramesh])
        )
    
    def test_unify_variable_with_existing_chain(self):
        x = Variable("x")
        y = Variable("y")
        ramesh = Constant("Ramesh")

        theta = {
            x: y,
            y: ramesh
        }

        result = unify(x, ramesh, theta)

        self.assertIsNotNone(result)
        self.assertEqual(apply_subst(result, x), ramesh)
    
    def test_clause_representation(self):
        x = Variable("x")

        p = Predicate("ValidPurchase", [x])
        q = Predicate("Eligible", [x])

        clause = Clause([
            Literal(p, True),
            Literal(q, False)
        ])

        self.assertEqual(len(clause.literals), 2)
        self.assertTrue(clause.literals[0].negated)
        self.assertFalse(clause.literals[1].negated)
    
    def test_resolution_with_unification(self):
        x = Variable("x")
        ramesh = Constant("Ramesh")

        clause1 = Clause([
            Literal(Predicate("ValidPurchase", [x]), True),
            Literal(Predicate("Eligible", [x]), False)
        ])

        clause2 = Clause([
            Literal(Predicate("ValidPurchase", [ramesh]), False)
        ])

        results = resolve(clause1, clause2)

        expected = Clause([
            Literal(Predicate("Eligible", [ramesh]), False)
        ])

        self.assertIn(expected, results)

    def test_resolution_fails_for_different_predicates(self):
        ramesh = Constant("Ramesh")

        clause1 = Clause([
            Literal(Predicate("ValidPurchase", [ramesh]), True)
        ])

        clause2 = Clause([
            Literal(Predicate("OwnsProduct", [ramesh]), False)
        ])

        results = resolve(clause1, clause2)

        self.assertEqual(results, [])

    def test_resolution_fails_for_conflicting_constants(self):
        ramesh = Constant("Ramesh")
        priya = Constant("Priya")

        clause1 = Clause([
            Literal(Predicate("ValidPurchase", [ramesh]), True)
        ])

        clause2 = Clause([
            Literal(Predicate("ValidPurchase", [priya]), False)
        ])

        results = resolve(clause1, clause2)

        self.assertEqual(results, [])
    
    def test_rule_to_clause(self):
        x = Variable("x")

        rule = Rule(
            Predicate("Eligible", [x]),
            [
                Predicate("ValidPurchase", [x]),
                Predicate("Consumer", [x])
            ]
        )

        clause = rule_to_clause(rule)

        self.assertEqual(len(clause.literals), 3)
        self.assertTrue(clause.literals[0].negated)
        self.assertTrue(clause.literals[1].negated)
        self.assertFalse(clause.literals[2].negated)

        self.assertEqual(
            clause.literals[2].predicate,
            Predicate("Eligible", [x])
    )
    
    def test_knowledge_base_to_clauses(self):
        kb = KnowledgeBase()
        x = Variable("x")

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("Eligible", [x]),
                [Predicate("ValidPurchase", [x])]
            )
        )

        clauses = kb.to_clauses()

        self.assertEqual(len(clauses), 2)

        # The first clause represents the fact.
        self.assertEqual(len(clauses[0].literals), 1)
        self.assertFalse(clauses[0].literals[0].negated)

        # The second clause represents the rule.
        self.assertEqual(len(clauses[1].literals), 2)
        self.assertTrue(clauses[1].literals[0].negated)
        self.assertFalse(clauses[1].literals[1].negated)
    
    def test_prove_by_resolution(self):
        kb = KnowledgeBase()
        x = Variable("x")
        ramesh = Constant("Ramesh")

        kb.add_fact(
            Predicate("ValidPurchase", [ramesh])
        )

        kb.add_rule(
            Rule(
                Predicate("Eligible", [x]),
                [Predicate("ValidPurchase", [x])]
            )
        )

        goal = Predicate("Eligible", [ramesh])

        self.assertTrue(kb.prove_by_resolution(goal))

    def test_resolution_cannot_prove_unknown_goal(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        goal = Predicate("Eligible", [Constant("Ramesh")])

        self.assertFalse(kb.prove_by_resolution(goal))

    def test_standardize_clause_apart(self):
        clause = Clause([
            Literal(
                Predicate("Human", [Variable("x")]),
                True
            ),
            Literal(
                Predicate("Mortal", [Variable("x")]),
                False
            )
        ])

        renamed = standardize_clause_apart(clause, "1")

        self.assertEqual(
            renamed.literals[0].predicate.args[0],
            Variable("x_1")
        )
        self.assertEqual(
            renamed.literals[1].predicate.args[0],
            Variable("x_1")
        )


    def test_resolution_standardizes_variables_apart(self):
        clause1 = Clause([
            Literal(
                Predicate("Knows", [Variable("x"), Constant("Ramesh")]),
                False
            )
        ])

        clause2 = Clause([
            Literal(
                Predicate("Knows", [Constant("Priya"), Variable("x")]),
                True
            )
        ])

        resolvents = resolve(clause1, clause2)

        self.assertTrue(len(resolvents) > 0)

        result = resolvents[0]

        for literal in result.literals:
            for variable in literal.predicate.get_variables():
                self.assertNotIn(variable.name, ["?x_A", "?x_B"])

    def test_resolution_produces_empty_clause(self):
        clause1 = Clause([
            Literal(
                Predicate("Eligible", [Constant("Ramesh")]),
                False
            )
        ])

        clause2 = Clause([
            Literal(
                Predicate("Eligible", [Constant("Ramesh")]),
                True
            )
        ])

        resolvents = resolve(clause1, clause2)

        self.assertTrue(
            any(len(clause.literals) == 0 for clause in resolvents)
        )

    def test_resolution_with_variable_and_constant(self):
        clause1 = Clause([
            Literal(
                Predicate("Eligible", [Variable("x")]),
                False
            )
        ])

        clause2 = Clause([
            Literal(
                Predicate("Eligible", [Constant("Ramesh")]),
                True
            )
        ])

        resolvents = resolve(clause1, clause2)

        self.assertTrue(
            any(len(clause.literals) == 0 for clause in resolvents)
        )

    def test_clause_key_ignores_literal_order(self):
        clause1 = Clause([
            Literal(Predicate("Eligible", [Constant("Ramesh")])),
            Literal(Predicate("ValidPurchase", [Constant("Ramesh")]))
        ])

        clause2 = Clause([
            Literal(Predicate("ValidPurchase", [Constant("Ramesh")])),
            Literal(Predicate("Eligible", [Constant("Ramesh")]))
        ])

        self.assertEqual(clause_key(clause1), clause_key(clause2))

    def test_clause_key_handles_three_literals(self):
        a = Literal(Predicate("A", [Constant("Ramesh")]))
        b = Literal(Predicate("B", [Constant("Ramesh")]))
        c = Literal(Predicate("C", [Constant("Ramesh")]))

        clause1 = Clause([a, b, c])
        clause2 = Clause([c, a, b])

        self.assertEqual(clause_key(clause1), clause_key(clause2))

    def test_empty_clause_representation(self):
        clause = Clause([])

        self.assertEqual(repr(clause), "{}")
        self.assertEqual(len(clause.literals), 0)

    def test_knowledge_base_does_not_duplicate_facts(self):
        kb = KnowledgeBase()

        fact = Predicate("Eligible", [Constant("Ramesh")])

        kb.add_fact(fact)
        kb.add_fact(fact)

        self.assertEqual(len(kb.facts), 1)

    def test_knowledge_base_does_not_duplicate_rules(self):
        kb = KnowledgeBase()

        rule = Rule(
            Predicate("Eligible", [Variable("x")]),
            [Predicate("ValidPurchase", [Variable("x")])]
        )

        kb.add_rule(rule)
        kb.add_rule(rule)

        self.assertEqual(len(kb.rules), 1)

    def test_knowledge_base_does_not_duplicate_equal_facts(self):
        kb = KnowledgeBase()

        fact1 = Predicate("Eligible", [Constant("Ramesh")])
        fact2 = Predicate("Eligible", [Constant("Ramesh")])

        kb.add_fact(fact1)
        kb.add_fact(fact2)

        self.assertEqual(len(kb.facts), 1)
        
    def test_knowledge_base_does_not_duplicate_equal_rules(self):
        kb = KnowledgeBase()

        rule1 = Rule(
            Predicate("Eligible", [Variable("x")]),
            [Predicate("ValidPurchase", [Variable("x")])]
        )

        rule2 = Rule(
            Predicate("Eligible", [Variable("x")]),
            [Predicate("ValidPurchase", [Variable("x")])]
        )

        kb.add_rule(rule1)
        kb.add_rule(rule2)

        self.assertEqual(len(kb.rules), 1)
        
    def test_knowledge_base_does_not_duplicate_rules_with_different_variables(self):
        kb = KnowledgeBase()

        rule1 = Rule(
            Predicate("Eligible", [Variable("x")]),
            [Predicate("ValidPurchase", [Variable("x")])]
        )

        rule2 = Rule(
            Predicate("Eligible", [Variable("y")]),
            [Predicate("ValidPurchase", [Variable("y")])]
        )

        kb.add_rule(rule1)
        kb.add_rule(rule2)

        self.assertEqual(len(kb.rules), 2)
        
    def test_knowledge_base_does_not_duplicate_rule_added_three_times(self):
        kb = KnowledgeBase()

        rule = Rule(
            Predicate("Eligible", [Variable("x")]),
            [Predicate("ValidPurchase", [Variable("x")])]
        )

        kb.add_rule(rule)
        kb.add_rule(rule)
        kb.add_rule(rule)

        self.assertEqual(len(kb.rules), 1)
    def test_knowledge_base_does_not_duplicate_fact_added_three_times(self):
        kb = KnowledgeBase()

        fact = Predicate("ValidPurchase", [Constant("Ramesh")])

        kb.add_fact(fact)
        kb.add_fact(fact)
        kb.add_fact(fact)

        self.assertEqual(len(kb.facts), 1)
    def test_derives_conclusion_from_two_facts(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForRelief", [Constant("Ramesh")])
        )

        self.assertTrue(result)
    def test_does_not_derive_conclusion_when_fact_is_missing(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForRelief", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_rule_derives_conclusion_for_different_person(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Priya")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Priya")])
        )

        rule = Rule(
            Predicate("EligibleForRelief", [Variable("x")]),
            [
                Predicate("ValidPurchase", [Variable("x")]),
                Predicate("FormalDefectFinding", [Variable("x")])
            ]
        )
        kb.add_rule(rule)

        result = kb.query(
            Predicate("EligibleForRelief", [Constant("Priya")])
        )

        self.assertTrue(result)
    def test_does_not_mix_facts_from_different_people(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Priya")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForRelief", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_unrelated_person_facts_do_not_block_conclusion(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Priya")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForRelief", [Constant("Ramesh")])
        )

        self.assertTrue(result)
    def test_does_not_treat_unrelated_predicate_as_required_fact(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("ProductDelivered", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForRelief", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_can_query_two_people_independently(self):
        kb = KnowledgeBase()

        for person in ["Ramesh", "Priya"]:
            kb.add_fact(
                Predicate("ValidPurchase", [Constant(person)])
            )
            kb.add_fact(
                Predicate("FormalDefectFinding", [Constant(person)])
            )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                        Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        ramesh_result = kb.query(
            Predicate("EligibleForRelief", [Constant("Ramesh")])
        )
        priya_result = kb.query(
            Predicate("EligibleForRelief", [Constant("Priya")])
        )

        self.assertTrue(ramesh_result)
        self.assertTrue(priya_result)
    def test_does_not_derive_conclusion_for_unknown_person(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForRelief", [Constant("Aman")])
        )

        self.assertFalse(result)
    def test_repeated_query_returns_same_result(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        query = Predicate(
            "EligibleForRelief", [Constant("Ramesh")]
        )

        first_result = kb.query(query)
        second_result = kb.query(query)

        self.assertTrue(first_result)
        self.assertEqual(first_result, second_result)
    def test_unrelated_conclusion_is_not_derived(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForRelief", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("CashRefundOrdered", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_derives_grandparent_using_shared_variable(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("Parent", [Constant("Alice"), Constant("Bob")])
        )
        kb.add_fact(
            Predicate("Parent", [Constant("Bob"), Constant("Charlie")])
        )

        kb.add_rule(
            Rule(
                Predicate(
                    "Grandparent",
                    [Variable("x"), Variable("z")]
                ),
                [
                    Predicate(
                        "Parent",
                        [Variable("x"), Variable("y")]
                    ),
                    Predicate(
                        "Parent",
                        [Variable("y"), Variable("z")]
                    )
                ]
            )
        )

        result = kb.query(
            Predicate(
                "Grandparent",
                [Constant("Alice"), Constant("Charlie")]
            )
        )

        self.assertTrue(result)
    def test_does_not_derive_grandparent_with_inconsistent_binding(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("Parent", [Constant("Alice"), Constant("Bob")])
        )
        kb.add_fact(
            Predicate("Parent", [Constant("Charlie"), Constant("David")])
        )

        kb.add_rule(
            Rule(
                Predicate(
                    "Grandparent",
                    [Variable("x"), Variable("z")]
                ),
                [
                    Predicate(
                        "Parent",
                        [Variable("x"), Variable("y")]
                    ),
                    Predicate(
                        "Parent",
                        [Variable("y"), Variable("z")]
                    )
                ]
            )
        )

        result = kb.query(
            Predicate(
                "Grandparent",
                [Constant("Alice"), Constant("David")]
            )
        )

        self.assertFalse(result)
    def test_derives_conclusion_from_three_rule_conditions(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("ProductDelivered", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForReview", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")]),
                    Predicate("ProductDelivered", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForReview", [Constant("Ramesh")])
        )

        self.assertTrue(result)
    def test_derives_conclusion_through_two_rules(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")])
                ]
            )
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForReview", [Variable("x")]),
                [
                    Predicate("PurchaseRecord", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForReview", [Constant("Ramesh")])
        )

        self.assertTrue(result)
    def test_chained_inference_works_when_rules_are_reversed(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        # Add the second rule first.
        kb.add_rule(
            Rule(
                Predicate("EligibleForReview", [Variable("x")]),
                [
                    Predicate("PurchaseRecord", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        # Add the first rule second.
        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForReview", [Constant("Ramesh")])
        )

        self.assertTrue(result)
    def test_chained_inference_fails_without_required_base_fact(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        first_rule = Rule(
            Predicate("PurchaseRecord", [Variable("x")]),
            [
                Predicate("ValidPurchase", [Variable("x")])
            ]
        )
        kb.add_rule(first_rule)

        second_rule = Rule(
            Predicate("EligibleForReview", [Variable("x")]),
            [
                Predicate("PurchaseRecord", [Variable("x")]),
                Predicate("FormalDefectFinding", [Variable("x")])
            ]
        )
        kb.add_rule(second_rule)

        result = kb.query(
        Predicate("EligibleForReview", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_uses_derived_intermediate_fact(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")])
                ]
            )
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForReview", [Variable("x")]),
                [
                    Predicate("PurchaseRecord", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        # PurchaseRecord is derived, not explicitly added as a fact.
        intermediate = kb.query(
            Predicate("PurchaseRecord", [Constant("Ramesh")])
        )
        final_result = kb.query(
            Predicate("EligibleForReview", [Constant("Ramesh")])
        )

        self.assertTrue(intermediate)
        self.assertTrue(final_result)
    def test_irrelevant_person_facts_do_not_complete_inference_chain(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )
        kb.add_fact(
            Predicate("FormalDefectFinding", [Constant("Priya")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")])
                ]
            )
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForReview", [Variable("x")]),
                [
                    Predicate("PurchaseRecord", [Variable("x")]),
                    Predicate("FormalDefectFinding", [Variable("x")])
                ]
            )
        )

        result = kb.query(
            Predicate("EligibleForReview", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_duplicate_derived_conclusions_are_stored_once(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [Predicate("ValidPurchase", [Variable("x")])]
            )
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("y")]),
                [Predicate("ValidPurchase", [Variable("y")])]
            )
        )

        derived = kb._derive_facts()

        matching = [
            fact for fact in derived
            if fact == Predicate(
            "PurchaseRecord", [Constant("Ramesh")]
            )
        ]

        self.assertEqual(len(matching), 1)
    def test_derived_fact_preserves_correct_person(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [Predicate("ValidPurchase", [Variable("x")])]
            )
        )

        derived = kb._derive_facts()

        self.assertIn(
            Predicate("PurchaseRecord", [Constant("Ramesh")]),
            derived
        )
        self.assertNotIn(
            Predicate("PurchaseRecord", [Constant("Priya")]),
            derived
        )
    def test_resolution_proves_conclusion_from_rule(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [
                    Predicate("ValidPurchase", [Variable("x")])
                ]
            )
        )

        result = kb.prove_by_resolution(
            Predicate("PurchaseRecord", [Constant("Ramesh")])
        )

        self.assertTrue(result)
    def test_resolution_proves_conclusion_through_two_rules(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [Predicate("ValidPurchase", [Variable("x")])]
            )
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleForReview", [Variable("x")]),
                [Predicate("PurchaseRecord", [Variable("x")])]
            )
        )

        result = kb.prove_by_resolution(
            Predicate("EligibleForReview", [Constant("Ramesh")])
        )

        self.assertTrue(result)
    def test_resolution_fails_when_required_fact_is_missing(self):
        kb = KnowledgeBase()

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [Predicate("ValidPurchase", [Variable("x")])]
            )
        )

        result = kb.prove_by_resolution(
            Predicate("PurchaseRecord", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_resolution_does_not_prove_opposite_predicate(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("InvalidPurchase", [Constant("Ramesh")])
        )

        result = kb.prove_by_resolution(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_resolution_does_not_use_unrelated_fact(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("OwnsPhone", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [Variable("x")]),
                [Predicate("ValidPurchase", [Variable("x")])]
            )
        )

        result = kb.prove_by_resolution(
            Predicate("PurchaseRecord", [Constant("Ramesh")])
        )

        self.assertFalse(result)
    def test_resolution_respects_max_steps_limit(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        result = kb.prove_by_resolution(
            Predicate("PurchaseRecord", [Constant("Ramesh")]),
            max_steps=0
        )

        self.assertFalse(result)
    def test_resolution_proves_simple_fact_with_step_limit(self):
        kb = KnowledgeBase()

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        result = kb.prove_by_resolution(
            Predicate("ValidPurchase", [Constant("Ramesh")]),
            max_steps=100
        )

        self.assertTrue(result)
class TestConsumerLawKnowledgeBase(unittest.TestCase):
    """
    Tests validating the educational domain model:
    - Verifying that alleged facts are strictly distinct from commission findings.
    - Demonstrating that consumer complaints do NOT automatically trigger refunds.
    - Verifying query matching against asserted facts.
    """

    def setUp(self):
        self.kb = create_consumer_law_kb()

    def test_allegation_exists_for_ramesh(self):
        """Case 1 (Ramesh): Verify that Ramesh has an alleged defect fact."""
        ramesh = Constant("Ramesh")
        query = Predicate(PRED_ALLEGES_DEFECT, [ramesh, Variable("goods"), Variable("issue")])

        matches = self.kb.query_facts(query)
        self.assertEqual(len(matches), 1, "Ramesh should have 1 alleged defect record.")
        _, subst = matches[0]
        self.assertEqual(subst[Variable("goods")], Constant("Smartphone_Model_Z"))
        self.assertEqual(subst[Variable("issue")], Constant("Battery_Overheating_Issue"))

    def test_distinction_allegation_is_not_commission_finding(self):
        """
        CRITICAL LEGAL REQUIREMENT:
        Ramesh alleged a defect in 'Smartphone_Model_Z', but the Consumer Commission
        has NOT adjudicated the claim or made any finding yet.
        Assert that querying for a commission finding returns NO matches!
        """
        phone = Constant("Smartphone_Model_Z")
        query_finding = Predicate(
            PRED_COMMISSION_FINDING_DEFECT,
            [Variable("commission"), phone, Variable("defect")]
        )

        matches = self.kb.query_facts(query_finding)
        self.assertEqual(
            len(matches), 0,
            "Legal invariant: An allegation is NOT a commission finding. "
            "No commission finding should exist for Ramesh's phone."
        )

    def test_adjudicated_finding_exists_for_priya(self):
        """
        Case 2 (Priya): In Priya's case, formal testing was conducted and the
        Commission officially issued a finding of defect.
        """
        purifier = Constant("AquaPure_RO_System")
        query_finding = Predicate(
            PRED_COMMISSION_FINDING_DEFECT,
            [Variable("commission"), purifier, Variable("defect")]
        )

        matches = self.kb.query_facts(query_finding)
        self.assertEqual(len(matches), 1, "Priya's purifier must have an official commission finding.")
        _, subst = matches[0]
        self.assertEqual(subst[Variable("commission")], Constant("District_Commission_Delhi"))
        self.assertEqual(subst[Variable("defect")], Constant("Contaminated_Filtration_Defect"))

    def test_no_automatic_refund_granted(self):
        """
        LEGAL ACCURACY REQUIREMENT:
        Ensure that consumers do NOT automatically qualify for a refund.
        In Priya's case, the Commission ordered 'Replace_Purifier_Unit' (replacement),
        not a cash refund.
        """
        priya = Constant("Priya")
        query_relief = Predicate(
            PRED_COMMISSION_ORDERED_RELIEF,
            [Variable("commission"), priya, Variable("seller"), Variable("relief")]
        )

        matches = self.kb.query_facts(query_relief)
        self.assertEqual(len(matches), 1)
        _, subst = matches[0]
        # Relief is replacement, showing refund is NOT an automatic default
        self.assertEqual(subst[Variable("relief")], Constant("Replace_Purifier_Unit"))
        self.assertNotEqual(subst[Variable("relief")], Constant("Refund"))

    def test_educational_rules_have_clarifying_comments(self):
        """Ensure all educational rules are documented with legal educational notes."""
        self.assertGreater(len(self.kb.rules), 0)
        for rule in self.kb.rules:
            self.assertTrue(
                len(rule.comment) > 0,
                f"Rule '{rule}' must include an educational comment clarifying its scope."
            )
    
    def test_query_infers_conclusion_from_rule(self):
        kb = KnowledgeBase()

        x = Variable("x")
        p = Variable("p")

        kb.add_fact(Predicate("Consumer", [Constant("Ramesh")]))
        kb.add_fact(
            Predicate("Purchased", [Constant("Ramesh"), Constant("Phone1")])
        )
        kb.add_fact(
            Predicate("DefectAlleged", [Constant("Ramesh"), Constant("Phone1")])
        )

        kb.add_rule(
            Rule(
                Predicate("PotentialComplaintGround", [x, p]),
                [
                    Predicate("Consumer", [x]),
                    Predicate("Purchased", [x, p]),
                    Predicate("DefectAlleged", [x, p]),
                ],
                comment="Simplified educational rule for testing",
            )
        )

        results = kb.query(
            Predicate(
                "PotentialComplaintGround",
                [Constant("Ramesh"), Constant("Phone1")],
            )
        )

        self.assertTrue(
            any(
                fact.name == "PotentialComplaintGround"
                and fact.args == (
                    Constant("Ramesh"),
                    Constant("Phone1"),
                )
                for fact, _ in results
            )
        )

    
    def test_query_does_not_return_duplicate_conclusions(self):
        kb = KnowledgeBase()

        x = Variable("x")

        kb.add_fact(Predicate("Consumer", [Constant("Ramesh")]))

        kb.add_rule(
        Rule(
            Predicate("Eligible", [x]),
            [Predicate("Consumer", [x])],
            comment="First derivation",
        )
    )

        kb.add_rule(
        Rule(
            Predicate("Eligible", [x]),
            [Predicate("Consumer", [x])],
            comment="Second derivation",
        )
    )

        results = kb.query(Predicate("Eligible", [Constant("Ramesh")]))

        matching_results = [
            fact for fact, _ in results
            if fact == Predicate("Eligible", [Constant("Ramesh")])
        ]

        self.assertEqual(len(matching_results), 1)

    def test_query_chains_two_rules(self):
        kb = KnowledgeBase()

        x = Variable("x")
        p = Variable("p")

        kb.add_fact(Predicate("Consumer", [Constant("Ramesh")]))
        kb.add_fact(
            Predicate("Purchased", [Constant("Ramesh"), Constant("Phone1")])
        )
        kb.add_fact(
            Predicate("DefectAlleged", [Constant("Ramesh"), Constant("Phone1")])
        )
        kb.add_fact(
            Predicate("SeeksRelief", [Constant("Ramesh"), Constant("Phone1")])
        )

        kb.add_rule(
            Rule(
                Predicate("PotentialComplaintGround", [x, p]),
                [
                    Predicate("Consumer", [x]),
                    Predicate("Purchased", [x, p]),
                    Predicate("DefectAlleged", [x, p]),
                ],
                comment="Simplified educational rule",
            )
        )

        kb.add_rule(
            Rule(
                Predicate("ComplaintProcedureRelevant", [x, p]),
                [
                    Predicate("PotentialComplaintGround", [x, p]),
                    Predicate("SeeksRelief", [x, p]),
                ],
                comment="Simplified educational rule",
            )
        )

        results = kb.query(
            Predicate(
                "ComplaintProcedureRelevant",
                [Constant("Ramesh"), Constant("Phone1")],
            )
        )

        
        self.assertTrue(
            any(
                fact.name == "ComplaintProcedureRelevant"
                and fact.args == (
                    Constant("Ramesh"),
                    Constant("Phone1"),
                )
                for fact, _ in results
            )
        )
    
    def test_query_chains_three_rules(self):
        kb = KnowledgeBase()
        x = Variable("x")

    # Starting fact
        kb.add_fact(
        Predicate("Consumer", [Constant("Ramesh")])
    )

    # Rule 1
        kb.add_rule(
        Rule(
            Predicate("RegisteredConsumer", [x]),
            [Predicate("Consumer", [x])],
            comment="Rule 1",
        )
    )

    # Rule 2
        kb.add_rule(
        Rule(
            Predicate("EligibleForReview", [x]),
            [Predicate("RegisteredConsumer", [x])],
            comment="Rule 2",
        )
    )

    # Rule 3
        kb.add_rule(
        Rule(
            Predicate("ReviewRecommended", [x]),
            [Predicate("EligibleForReview", [x])],
            comment="Rule 3",
        )
    )

    # Query the conclusion from the third rule
        results = kb.query(
        Predicate("ReviewRecommended", [Constant("Ramesh")])
    )

        self.assertTrue(
            any(
                fact == Predicate(
                    "ReviewRecommended", [Constant("Ramesh")]
                )
                for fact, _ in results
        )
    )

    
    def test_explain_identifies_supporting_rule_and_fact(self):
        kb = KnowledgeBase()
        x = Variable("x")

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [x]),
                [Predicate("ValidPurchase", [x])],
            )
        )

        result = kb.explain(
            Predicate("PurchaseRecord", [Constant("Ramesh")])
        )

        self.assertTrue(result["proved"])
        self.assertEqual(len(result["applied_rules"]), 1)
        self.assertEqual(
            result["applied_rules"][0]["conditions"][0]["condition"],
            "ValidPurchase(Ramesh)",
        )
        self.assertTrue(
            result["applied_rules"][0]["conditions"][0]["satisfied"]
        )
        self.assertIn(
            "ValidPurchase(Ramesh)",
            result["applied_rules"][0]["conditions"][0]["matching_facts"],
        )

    def test_recursive_rule_terminates(self):
        kb = KnowledgeBase()
        x = Variable("x")

        kb.add_fact(Predicate("Consumer", [Constant("Ramesh")]))

    # Recursive rule: Consumer(x) implies Consumer(x).
        kb.add_rule(
        Rule(
            Predicate("Consumer", [x]),
            [Predicate("Consumer", [x])],
            comment="Recursive rule for testing",
        )
    )

        results = kb.query(
            Predicate("Consumer", [Constant("Ramesh")])
    )

        self.assertEqual(len(results), 1)
        self.assertEqual(
        results[0][0],
        Predicate("Consumer", [Constant("Ramesh")])
    )

    
    def test_explain_identifies_final_rule_in_two_rule_chain(self):
        kb = KnowledgeBase()
        x = Variable("x")

        kb.add_fact(
            Predicate("ValidPurchase", [Constant("Ramesh")])
        )

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [x]),
                [Predicate("ValidPurchase", [x])],
            )
        )

        kb.add_rule(
            Rule(
                Predicate("ConsumerVerified", [x]),
                [Predicate("PurchaseRecord", [x])],
            )
        )

        result = kb.explain(
            Predicate("ConsumerVerified", [Constant("Ramesh")])
        )

        self.assertTrue(result["proved"])
        self.assertEqual(len(result["applied_rules"]), 2)
        self.assertEqual(
            result["applied_rules"][-1]["conditions"][0]["condition"],
            "PurchaseRecord(Ramesh)",
        )
        self.assertTrue(
            result["applied_rules"][0]["conditions"][0]["satisfied"]
        )
    
    def test_explain_does_not_prove_missing_condition(self):
        kb = KnowledgeBase()
        x = Variable("x")

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [x]),
                [Predicate("ValidPurchase", [x])],
            )
        )

        result = kb.explain(
            Predicate("PurchaseRecord", [Constant("Ramesh")])
        )
        
        self.assertFalse(result["proved"])
        self.assertEqual(result["applied_rules"], [])
        self.assertEqual(result["supporting_facts"], [])
    
    def test_explain_traces_two_rule_chain_to_original_fact(self):
        kb = KnowledgeBase()
        x = Variable("x")

        original_fact = Predicate(
            "ValidPurchase", [Constant("Ramesh")]
        )
        kb.add_fact(original_fact)

        kb.add_rule(
            Rule(
                Predicate("PurchaseRecord", [x]),
                [Predicate("ValidPurchase", [x])],
            )
        )

        kb.add_rule(
            Rule(
                Predicate("ConsumerVerified", [x]),
                [Predicate("PurchaseRecord", [x])],
            )
        )

        result = kb.explain(
            Predicate("ConsumerVerified", [Constant("Ramesh")])
        )

        self.assertTrue(result["proved"])
        self.assertIn(
            "ValidPurchase(Ramesh)",
            result["supporting_facts"],
        )
        self.assertEqual(len(result["applied_rules"]), 2)
    
    def test_explain_includes_multiple_rules_for_same_conclusion(self):
        kb = KnowledgeBase()
        x = Variable("x")

        kb.add_fact(Predicate("ValidPurchase", [Constant("Ramesh")]))
        kb.add_fact(Predicate("WarrantyRegistered", [Constant("Ramesh")]))

        kb.add_rule(
            Rule(
                Predicate("EligibleConsumer", [x]),
                [Predicate("ValidPurchase", [x])],
                comment="Purchase record supports eligibility",
            )
        )

        kb.add_rule(
            Rule(
                Predicate("EligibleConsumer", [x]),
                [Predicate("WarrantyRegistered", [x])],
                comment="Warranty registration supports eligibility",
            )
        )

        result = kb.explain(
            Predicate("EligibleConsumer", [Constant("Ramesh")])
        )

        self.assertTrue(result["proved"])
        self.assertEqual(len(result["applied_rules"]), 2)

        explained_rules = [
            item["rule"] for item in result["applied_rules"]
        ]
        self.assertIn(
            "EligibleConsumer(?x) :- ValidPurchase(?x).",
            explained_rules,
        )
        self.assertIn(
            "EligibleConsumer(?x) :- WarrantyRegistered(?x).",
            explained_rules,
        )

        self.assertIn("ValidPurchase(Ramesh)", result["supporting_facts"])
        self.assertIn(
            "WarrantyRegistered(Ramesh)",
            result["supporting_facts"],
        )

    
    def test_explain_does_not_mix_facts_from_different_people(self):
        kb = KnowledgeBase()
        x = Variable("x")

        kb.add_fact(Predicate("ValidPurchase", [Constant("Ramesh")]))
        kb.add_fact(Predicate("WarrantyRegistered", [Constant("Priya")]))

        kb.add_rule(
            Rule(
                Predicate("EligibleConsumer", [x]),
                [
                    Predicate("ValidPurchase", [x]),
                    Predicate("WarrantyRegistered", [x]),
                ],
            )
        )

        result = kb.explain(
            Predicate("EligibleConsumer", [Constant("Ramesh")])
        )

        self.assertFalse(result["proved"])
        self.assertEqual(result["applied_rules"], [])
        self.assertEqual(result["supporting_facts"], [])

if __name__ == "__main__":
    unittest.main()
