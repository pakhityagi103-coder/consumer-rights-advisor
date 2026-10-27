
from flask import Flask, jsonify, request

from logic_engine import Constant, KnowledgeBase, Predicate, Rule, Variable

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



if __name__ == "__main__":
    app.run(debug=True)
