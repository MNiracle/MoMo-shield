def analyze_transaction(
    recipient: str,
    amount: float,
    identity_confidence: int = 0
):
    risk_score = 0
    signals = []

    # Individual risk components
    identity_risk = 0
    transaction_risk = 0
    recipient_risk = 0

    # -----------------------------
    # 1. Transaction amount
    # -----------------------------
    if amount >= 1000:
        transaction_risk = 30
        risk_score += transaction_risk
        signals.append("Transaction amount is unusually high.")

    elif amount >= 500:
        transaction_risk = 15
        risk_score += transaction_risk
        signals.append("Transaction amount requires additional attention.")

    else:
        signals.append("Transaction amount is within the normal range.")

    # -----------------------------
    # 2. Recipient format
    # -----------------------------
    if not recipient.isdigit() or len(recipient) < 9:
        recipient_risk = 40
        risk_score += recipient_risk
        signals.append(
            "Recipient information could not be confidently verified."
        )

    else:
        signals.append("Recipient format appears valid.")

    # -----------------------------
    # 3. Identity confidence
    # -----------------------------
    if identity_confidence >= 90:

        signals.append(
            "Recipient identity has a high confidence match."
        )

    elif identity_confidence >= 60:

        identity_risk = 10
        risk_score += identity_risk

        signals.append(
            "Recipient identity is partially verified."
        )

    else:

        identity_risk = 35
        risk_score += identity_risk

        signals.append(
            "Recipient identity confidence is low."
        )

    # Keep score between 0 and 100
    risk_score = min(risk_score, 100)

    # -----------------------------
    # 4. Risk classification
    # -----------------------------
    if risk_score >= 70:

        risk_level = "HIGH RISK"

        recommendation = (
            "Stop and verify the recipient before sending."
        )

    elif risk_score >= 30:

        risk_level = "CAUTION"

        recommendation = (
            "Verify the recipient before proceeding."
        )

    else:

        risk_level = "SAFE"

        recommendation = (
            "No significant risk indicators detected."
        )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "signals": signals,
        "recommendation": recommendation,
        "identity_confidence": identity_confidence,
        "risk_breakdown": {
            "identity_risk": identity_risk,
            "transaction_risk": transaction_risk,
            "recipient_risk": recipient_risk
        }
    }