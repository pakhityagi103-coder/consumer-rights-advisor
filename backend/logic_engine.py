"""
Logic Engine Foundation for First-Order Logic (FOL)
===================================================

Academic Reference:
- Russell, S., & Norvig, P. "Artificial Intelligence: A Modern Approach" (AIMA),
  Chapter 8 (First-Order Logic) & Chapter 9 (Inference in First-Order Logic).

This module provides the core data structures and algorithms for beginner-friendly
First-Order Logic:
1. Terms: Variables and Constants.
2. Predicates (Atoms): Relations applied to arguments.
3. Rules (Horn Clauses): Head and body representation.
4. Substitutions: Variable-to-term bindings.
5. Unification: Robinson's Unification Algorithm with occurs-check.
6. KnowledgeBase: Container for facts and rules with simple fact-matching.

NOTE ON RESOLUTION:
Full First-Order Logic Resolution / SLD-Resolution / Automated Theorem Proving
is NOT implemented in this foundation module. This module provides the essential
prerequisites: Term representation, substitution application, Robinson unification,
and single-step query-to-fact pattern matching.
"""

from typing import Dict, List, Optional, Sequence, Tuple, Union, Any


# ============================================================================
# 1. TERMS: Variables and Constants
# ============================================================================

class Term:
    """Base class for all first-order logic terms."""
    pass


class Variable(Term):
    """
    Represents a logical variable in First-Order Logic (e.g., ?x, ?consumer, ?goods).

    Variables represent placeholders that can be bound to constants or other variables
    during unification. By convention in this engine, variables can be given any
    name, but prefixing with '?' or using descriptive names (like 'Consumer', 'x')
    is recommended for readability.
    """

    def __init__(self, name: str) -> None:
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Variable name must be a non-empty string.")
        # Store clean name; ensure leading '?' for distinct visual representation
        clean_name = name.strip()
        self.name: str = clean_name if clean_name.startswith("?") else f"?{clean_name}"

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, other: Any) -> bool:
        return isinstance(other, Variable) and self.name == other.name

    def __hash__(self) -> int:
        return hash(("Variable", self.name))


class Constant(Term):
    """
    Represents an individual constant object/entity in the domain of discourse
    (e.g., 'Ramesh', 'Laptop_Model_X', 'ABC_Electronics_Ltd', 'True', 'False').
    """

    def __init__(self, name: str) -> None:
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Constant name must be a non-empty string.")
        self.name: str = name.strip()

    def __repr__(self) -> str:
        return self.name

    def __eq__(self, other: Any) -> bool:
        return isinstance(other, Constant) and self.name == other.name

    def __hash__(self) -> int:
        return hash(("Constant", self.name))


# ============================================================================
# 2. PREDICATES (ATOMS)
# ============================================================================

class Predicate:
    """
    Represents a First-Order Logic predicate / atomic formula.

    A predicate has:
    - a symbol name (e.g., 'alleges_defect', 'commission_finding_defect')
    - a tuple of argument terms (Constants or Variables).

    Example:
        alleges_defect(?consumer, LaptopX, BatteryOverheating)
    """

    def __init__(self, name: str, args: Sequence[Term]) -> None:
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Predicate name must be a non-empty string.")
        self.name: str = name.strip()
        self.args: Tuple[Term, ...] = tuple(args)

    @property
    def arity(self) -> int:
        """Returns the number of arguments (arity) of the predicate."""
        return len(self.args)

    def is_ground(self) -> bool:
        """
        Returns True if the predicate is ground (i.e., contains NO variables).
        A ground predicate represents a concrete, specific fact.
        """
        return all(isinstance(arg, Constant) for arg in self.args)

    def get_variables(self) -> List[Variable]:
        """Returns a list of all distinct variables appearing in the predicate arguments."""
        vars_found: List[Variable] = []
        for arg in self.args:
            if isinstance(arg, Variable) and arg not in vars_found:
                vars_found.append(arg)
        return vars_found

    def __repr__(self) -> str:
        args_str = ", ".join(repr(arg) for arg in self.args)
        return f"{self.name}({args_str})"

    def __eq__(self, other: Any) -> bool:
        return (
            isinstance(other, Predicate)
            and self.name == other.name
            and self.args == other.args
        )

    def __hash__(self) -> int:
        return hash(("Predicate", self.name, self.args))


class Literal:
    """Represents a positive or negative FOL literal."""

    def __init__(self, predicate: Predicate, negated: bool = False) -> None:
        if not isinstance(predicate, Predicate):
            raise TypeError("Literal requires a Predicate.")

        self.predicate = predicate
        self.negated = negated

    def __repr__(self) -> str:
        prefix = "~" if self.negated else ""
        return f"{prefix}{self.predicate}"

    def __eq__(self, other: Any) -> bool:
        return (
            isinstance(other, Literal)
            and self.predicate == other.predicate
            and self.negated == other.negated
        )

    def __hash__(self) -> int:
        return hash((self.predicate, self.negated))

class Clause:
    """Represents a disjunction (OR) of literals."""

    def __init__(self, literals: Sequence[Literal]) -> None:
        self.literals: Tuple[Literal, ...] = tuple(literals)

    def __repr__(self) -> str:
        if not self.literals:
            return "{}"  # Empty clause: contradiction

        return " OR ".join(repr(lit) for lit in self.literals)

    def __eq__(self, other: Any) -> bool:
        return (
            isinstance(other, Clause)
            and self.literals == other.literals
        )

    def __hash__(self) -> int:
        return hash(self.literals)

    
def standardize_clause_apart(clause: Clause, suffix: str) -> Clause:
    """Rename variables in a clause to avoid name collisions."""
    substitutions: Substitution = {}

    for literal in clause.literals:
        for variable in literal.predicate.get_variables():
            if variable not in substitutions:
                substitutions[variable] = Variable(
                    f"{variable.name.lstrip('?')}_{suffix}"
                )

    new_literals = []

    for literal in clause.literals:
        new_predicate = apply_subst(
            substitutions,
            literal.predicate
        )
        new_literals.append(
            Literal(new_predicate, literal.negated)
        )

    return Clause(new_literals)

def resolve(
    clause1: Clause,
    clause2: Clause
) -> List[Clause]:
    """Resolve two clauses using complementary literals and unification."""
    resolvents = []
    clause1 = standardize_clause_apart(clause1, "A")
    clause2 = standardize_clause_apart(clause2, "B")

    for i, lit1 in enumerate(clause1.literals):
        for j, lit2 in enumerate(clause2.literals):

            # Resolution requires opposite signs and matching predicates.
            if lit1.negated == lit2.negated:
                continue

            subst = unify(
                lit1.predicate,
                lit2.predicate,
                {}
            )

            if subst is None:
                continue

            # Remove the complementary pair.
            remaining = (
                list(clause1.literals[:i])
                + list(clause1.literals[i + 1:])
                + list(clause2.literals[:j])
                + list(clause2.literals[j + 1:])
            )

            # Apply the unifier to every remaining literal.
            new_literals = [
                Literal(
                    apply_subst(subst, lit.predicate),
                    lit.negated
                )
                for lit in remaining
            ]

            resolvent = Clause(new_literals)

            if resolvent not in resolvents:
                resolvents.append(resolvent)

    return resolvents



def clause_key(clause: Clause) -> tuple:
    """Create an order-independent key for a clause."""
    return tuple(sorted(
        (literal.negated, literal.predicate.name,
         tuple(repr(arg) for arg in literal.predicate.args))
        for literal in clause.literals
    ))

# ============================================================================
# 3. RULES (Horn Clauses)
# ============================================================================

class Rule:
    """
    Represents a simplified Horn clause / inference rule:
        head :- body_1, body_2, ..., body_n
    which logically signifies:
        body_1 AND body_2 AND ... AND body_n IMPLIES head

    Example:
        eligible_for_inquiry(?c, ?g) :- is_consumer(?c, ?g), alleges_defect(?c, ?g, ?d)
    """

    def __init__(self, head: Predicate, body: Sequence[Predicate], comment: str = "") -> None:
        self.head: Predicate = head
        self.body: Tuple[Predicate, ...] = tuple(body)
        self.comment: str = comment

    def __repr__(self) -> str:
        if not self.body:
            return f"{self.head}."
        body_str = ", ".join(repr(p) for p in self.body)
        return f"{self.head} :- {body_str}."


    def __eq__(self, other: Any) -> bool:
        return (
        isinstance(other, Rule)
        and self.head == other.head
        and self.body == other.body
        and self.comment == other.comment
    )

    def __hash__(self) -> int:
        return hash((self.head, self.body, self.comment))

    
# ============================================================================
# 4. SUBSTITUTIONS
# ============================================================================

# A Substitution is represented as a dictionary mapping Variable to Term.
Substitution = Dict[Variable, Term]


def apply_subst(theta: Substitution, expr: Union[Term, Predicate, Rule]) -> Any:
    """
    Applies substitution theta to an expression (Term, Predicate, or Rule).
    Handles transitive bindings (e.g. if ?x -> ?y and ?y -> Ramesh, ?x resolves to Ramesh).
    """
    if not theta:
        return expr

    if isinstance(expr, Variable):
        # Resolve through chain of variable substitutions
        current: Term = expr
        visited = set()
        while isinstance(current, Variable) and current in theta:
            if current in visited:
                break  # Cycle guard
            visited.add(current)
            current = theta[current]
        return current

    elif isinstance(expr, Constant):
        # Constants remain unchanged
        return expr

    elif isinstance(expr, Predicate):
        # Apply substitution recursively to all arguments
        new_args = [apply_subst(theta, arg) for arg in expr.args]
        return Predicate(expr.name, new_args)

    elif isinstance(expr, Rule):
        new_head = apply_subst(theta, expr.head)
        new_body = [apply_subst(theta, b) for b in expr.body]
        return Rule(new_head, new_body, expr.comment)

    return expr


# ============================================================================
# 5. UNIFICATION ALGORITHM (Robinson's Algorithm with Occurs Check)
# ============================================================================


def occurs_check(var: Variable, x: Term, theta: Substitution) -> bool:
    """
    Return True if var occurs anywhere inside x after substitutions.
    Prevents circular terms such as x = Related(x).
    """
    resolved_x = apply_subst(theta, x)

    if var == resolved_x:
        return True

    if isinstance(resolved_x, Predicate):
        return any(
            occurs_check(var, arg, theta)
            for arg in resolved_x.args
        )

    if isinstance(resolved_x, (list, tuple)):
        return any(
            occurs_check(var, item, theta)
            for item in resolved_x
        )

    return False



def unify_var(var: Variable, x: Term, theta: Substitution) -> Optional[Substitution]:
    """
    Unifies a Variable `var` with a Term `x` in the context of substitution `theta`.
    """
    if var in theta:
        return unify(theta[var], x, theta)
    elif isinstance(x, Variable) and x in theta:
        return unify(var, theta[x], theta)
    elif occurs_check(var, x, theta):
        return None  # Occurs-check failed
    else:
        # Create a new substitution containing the new binding
        new_theta = dict(theta)
        new_theta[var] = x
        return new_theta


def unify(
    x: Any,
    y: Any,
    theta: Optional[Substitution] = None
) -> Optional[Substitution]:
    """
    Finds the Most General Unifier (MGU) for two first-order expressions x and y.

    Returns:
        Substitution dictionary if x and y unify.
        None if unification fails.

    Algorithm Reference:
        Russell & Norvig, AIMA (3rd/4th Edition), Chapter 9:
        UNIFY(x, y, theta)
    """
    if theta is None:
        theta = {}

    # If already failed in a previous recursive step
    if theta is None:
        return None

    # Step 1: Identical expressions trivially unify
    if x == y:
        return theta

    # Step 2: If x is a Variable
    elif isinstance(x, Variable):
        return unify_var(x, y, theta)

    # Step 3: If y is a Variable
    elif isinstance(y, Variable):
        return unify_var(y, x, theta)

    # Step 4: If both are Predicates
    elif isinstance(x, Predicate) and isinstance(y, Predicate):
        # Predicate names and arities must match
        if x.name != y.name or x.arity != y.arity:
            return None
        # Unify arguments sequentially
        return unify(x.args, y.args, theta)

    # Step 5: If both are sequences of arguments (lists or tuples)
    elif isinstance(x, (list, tuple)) and isinstance(y, (list, tuple)):
        if len(x) != len(y):
            return None
        if len(x) == 0:
            return theta
        # Unify first elements
        first_theta = unify(x[0], y[0], theta)
        if first_theta is None:
            return None
        # Recursively unify remaining elements with updated substitution
        return unify(x[1:], y[1:], first_theta)

    # Step 6: Different constants or mismatched types cannot unify
    else:
        return None
def rule_to_clause(rule: Rule) -> Clause:
        """Convert a Horn rule into a clause for resolution."""
        literals = []

        # Negate each condition in the rule body.
        for condition in rule.body:
            literals.append(Literal(condition, True))

        # Add the rule conclusion as a positive literal.
        literals.append(Literal(rule.head, False))

        return Clause(literals)


# ============================================================================
# 6. KNOWLEDGE BASE CONTAINER
# ============================================================================

class KnowledgeBase:
    """
    Stores First-Order Logic facts and rules.

    Provides basic pattern matching and query unification against asserted facts.
    """

    def __init__(self, name: str = "ConsumerProtectionKB") -> None:
        self.name: str = name
        self.facts: List[Predicate] = []
        self.rules: List[Rule] = []

    def add_fact(self, fact: Predicate) -> None:
        """Adds a fact to the Knowledge Base (avoids duplicates)."""
        if not isinstance(fact, Predicate):
            raise TypeError("Fact must be a Predicate instance.")
        if fact not in self.facts:
            self.facts.append(fact)

    
    def add_rule(self, rule: Rule) -> None:
        """Add a rule if it is not already in the knowledge base."""
        if rule not in self.rules:
            self.rules.append(rule)


    def query_facts(self, query: Predicate) -> List[Tuple[Predicate, Substitution]]:
        """
        Unifies a query predicate against all facts in the Knowledge Base.

        Returns:
            A list of tuples: (matched_fact, substitution)
            for each fact that unifies with the query.
        """
        matches: List[Tuple[Predicate, Substitution]] = []
        for fact in self.facts:
            subst = unify(query, fact, {})
            if subst is not None:
                matches.append((fact, subst))
        return matches
    
    def _match_rule_body(
        self,
        body: Tuple[Predicate, ...],
        index: int = 0,
        theta: Optional[Substitution] = None
    ) -> List[Substitution]:
        """Find substitutions that satisfy every condition in a rule body."""
        if theta is None:
            theta = {}

        # All conditions have been satisfied.
        if index == len(body):
            return [theta]

        # Apply substitutions found so far to the current condition.
        current_goal = apply_subst(theta, body[index])
        results: List[Substitution] = []

        # Derive facts once, then match against them.
        known_facts = self._derive_facts()

        for fact in known_facts:
            new_theta = unify(current_goal, fact, theta)

            if new_theta is not None:
                results.extend(
                    self._match_rule_body(body, index + 1, new_theta)
                )

        return results
    
    def _derive_facts(self) -> List[Predicate]:
        """Derive conclusions repeatedly until no new facts can be added."""
        known_facts = list(self.facts)

        changed = True
        while changed:
            changed = False

            for rule in self.rules:
                variable_map = {}

                def freshen(term):
                    if isinstance(term, Variable):
                        if term not in variable_map:
                            variable_map[term] = Variable(
                                f"{term.name}_derive_{len(variable_map)}"
                            )
                        return variable_map[term]

                    if isinstance(term, Predicate):
                        return Predicate(
                            term.name,
                            [freshen(arg) for arg in term.args],
                        )

                    return term

                fresh_rule = Rule(
                    freshen(rule.head),
                    [freshen(condition) for condition in rule.body],
                    rule.comment,
                )

                # Match the rule body against known facts only.
                def match_body(index=0, theta=None):
                    if theta is None:
                        theta = {}

                    if index == len(fresh_rule.body):
                        return [theta]

                    current_goal = apply_subst(
                        theta, fresh_rule.body[index]
                    )
                    matches = []

                    for fact in known_facts:
                        new_theta = unify(current_goal, fact, theta)

                        if new_theta is not None:
                            matches.extend(
                                match_body(index + 1, new_theta)
                            )

                    return matches

                for subst in match_body():
                    conclusion = apply_subst(subst, fresh_rule.head)

                    # Only add fully grounded conclusions.
                    if any(
                        isinstance(arg, Variable)
                        for arg in conclusion.args
                    ):
                        continue

                    if not any(
                        existing == conclusion for existing in known_facts
                    ):
                        known_facts.append(conclusion)
                        changed = True

        return known_facts

   
    def query(self, goal: Predicate) -> List[Tuple[Predicate, Substitution]]:
        """Return facts and conclusions that match the requested goal."""
        results = []

        for fact in self._derive_facts():
            theta = unify(goal, fact, {})
            if theta is not None:
                results.append((fact, theta))

        return results

    
    def to_clauses(self) -> List[Clause]:
        """Convert all knowledge-base facts and rules into clauses."""
        clauses = []

        # Each fact becomes a single positive literal.
        for fact in self.facts:
            clauses.append(
                Clause([Literal(fact, False)])
            )

        # Convert every rule into its clause form.
        for rule in self.rules:
            clauses.append(rule_to_clause(rule))

        return clauses
    
    def prove_by_resolution(
        self,
        goal: Predicate,
        max_steps: int = 1000
    ) -> bool:
        """Attempt to prove a ground goal using resolution by contradiction."""
        if not goal.is_ground():
            raise ValueError("Resolution proof currently requires a ground goal.")

        clauses = self.to_clauses()
        clauses.append(
            Clause([Literal(goal, True)])
        )

        known = {clause_key(clause) for clause in clauses}
        agenda = list(clauses)
        steps = 0

        while agenda and steps < max_steps:
            current = agenda.pop(0)

            for other in list(clauses):
                if current == other:
                    continue

                for resolvent in resolve(current, other):
                    steps += 1

                    # Empty clause means contradiction was derived.
                    if not resolvent.literals:
                        return True

                    key = clause_key(resolvent)

                    if key not in known:
                        known.add(key)
                        clauses.append(resolvent)
                        agenda.append(resolvent)

                    if steps >= max_steps:
                        break

                if steps >= max_steps:
                    break

        return False
    
    def _trace_support(
        self,
        fact: Predicate,
        known_facts: List[Predicate],
        visited: Optional[set] = None,
    ) -> Tuple[List[str], List[Dict[str, Any]]]:
        """Trace a derived fact back to its asserted facts and rules."""
        if visited is None:
            visited = set()

        fact_key = repr(fact)

        if fact_key in visited:
            return [], []

        visited.add(fact_key)

        # Base case: this fact was explicitly asserted.
        if fact in self.facts:
            return [repr(fact)], []

        supporting_facts = []
        applied_rules = []

        for rule in self.rules:
            substitution = unify(rule.head, fact, {})

            if substitution is None:
                continue

            rule_supporting_facts = []
            rule_chain = []
            conditions = []

            for body_condition in rule.body:
                condition = apply_subst(substitution, body_condition)

                matching_facts = [
                    candidate
                    for candidate in known_facts
                    if unify(condition, candidate, {}) is not None
                ]

                conditions.append({
                    "condition": repr(condition),
                    "satisfied": bool(matching_facts),
                    "matching_facts": [
                        repr(candidate) for candidate in matching_facts
                    ],
                })

                if not matching_facts:
                    continue

                for candidate in matching_facts:
                    facts, chain = self._trace_support(
                        candidate, known_facts, visited.copy()
                    )
                    rule_supporting_facts.extend(facts)
                    rule_chain.extend(chain)

            if all(item["satisfied"] for item in conditions):
                supporting_facts.extend(rule_supporting_facts)
                applied_rules.extend(rule_chain)
                applied_rules.append({
                    "rule": repr(rule),
                    "comment": rule.comment,
                    "conditions": conditions,
                })

        # Remove duplicate fact descriptions while preserving order.
        supporting_facts = list(dict.fromkeys(supporting_facts))

        return supporting_facts, applied_rules

    def explain(self, goal: Predicate) -> Dict[str, Any]:
        """Explain a goal using matching facts and supporting rules."""
        
        known_facts = self._derive_facts()

        matched_fact = None
        substitution = None

        for fact in known_facts:
            result = unify(goal, fact, {})
            if result is not None:
                matched_fact = fact
                substitution = result
                break

        # A derived conclusion must have a valid supporting rule.
        if matched_fact is not None and matched_fact not in self.facts:
            supporting_facts, traced_rules = self._trace_support(
                matched_fact, known_facts
            )

            if not traced_rules:
                matched_fact = None
                substitution = None
        
        if matched_fact is None:
            return {
                "goal": repr(goal),
                "proved": False,
                "explanation": "No matching fact or derived conclusion was found.",
                "supporting_facts": [],
                "applied_rules": [],
            }


        if matched_fact is None:
            
            supporting_facts, traced_rules = self._trace_support(
            matched_fact, known_facts
        )
        
        supporting_facts, traced_rules = self._trace_support(
            matched_fact, known_facts
        )

        return {
            "goal": repr(goal),
            "proved": True,
            "matched_fact": repr(matched_fact),
            "substitution": {
                str(key): repr(value)
                for key, value in (substitution or {}).items()
            },
            "explanation": "The goal matches a derived conclusion.",
            "supporting_facts": supporting_facts,
            "applied_rules": traced_rules,
        }


        # If the goal is directly present in the knowledge base,
        # report that asserted fact.
        if matched_fact in self.facts:
            return {
                "goal": repr(goal),
                "proved": True,
                "matched_fact": repr(matched_fact),
                "explanation": "The goal matches a fact explicitly stored in the knowledge base.",
                "supporting_facts": [repr(matched_fact)],
                "applied_rules": [],
            }

        
        
        # Find rules whose heads match the derived conclusion.
        applied_rules = []

        for rule in self.rules:
            result = unify(rule.head, matched_fact, {})

            if result is None:
                continue

            conditions = [
                apply_subst(result, condition)
                for condition in rule.body
            ]

            satisfied_conditions = []

            for condition in conditions:
                matching_facts = [
                    fact for fact in known_facts
                    if unify(condition, fact, {}) is not None
                ]

                satisfied_conditions.append({
                    "condition": repr(condition),
                    "satisfied": bool(matching_facts),
                    "matching_facts": [
                        repr(fact) for fact in matching_facts
                    ],
                })

            applied_rules.append({
                "rule": repr(rule),
                "comment": rule.comment,
                "conditions": satisfied_conditions,
            })


        return {
            "goal": repr(goal),
            "proved": True,
            "matched_fact": repr(matched_fact),
            "substitution": {
                str(key): repr(value)
                for key, value in (substitution or {}).items()
            },
            "explanation": "The goal matches a derived conclusion.",
            "supporting_facts": [],
            "applied_rules": applied_rules,
        }


    def __repr__(self) -> str:
        return f"KnowledgeBase('{self.name}', facts={len(self.facts)}, rules={len(self.rules)})"
