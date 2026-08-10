def generate_life_trends(classification, line_analysis):

    trends = {}

    palm = classification.get("palm_shape", "Unknown")

    heart = line_analysis.get("heart_line", {}).get("status", "Moderate")
    head = line_analysis.get("head_line", {}).get("status", "Moderate")
    life = line_analysis.get("life_line", {}).get("status", "Moderate")

    # ---------------- Career ----------------
    if palm == "Fire":
        career = {
            "trend": "Excellent",
            "description": "Leadership and innovation opportunities are likely to increase over the coming years."
        }

    elif palm == "Air":
        career = {
            "trend": "Good",
            "description": "Communication and analytical skills will help you grow professionally."
        }

    elif palm == "Water":
        career = {
            "trend": "Good",
            "description": "Creative careers and people-oriented roles will suit your long-term growth."
        }

    else:
        career = {
            "trend": "Stable",
            "description": "Steady progress through discipline and consistency."
        }

    # ---------------- Relationships ----------------
    if heart == "Strong":
        relationship = {
            "trend": "Positive",
            "description": "Healthy emotional connections and supportive relationships are expected."
        }

    elif heart == "Moderate":
        relationship = {
            "trend": "Balanced",
            "description": "Relationships remain stable with open communication."
        }

    else:
        relationship = {
            "trend": "Needs Attention",
            "description": "Spend more time strengthening emotional communication."
        }

    # ---------------- Health ----------------
    if life == "Strong":
        health = {
            "trend": "Healthy",
            "description": "Overall vitality appears strong. Continue maintaining healthy habits."
        }

    elif life == "Moderate":
        health = {
            "trend": "Stable",
            "description": "Maintain exercise, nutrition, and stress management."
        }

    else:
        health = {
            "trend": "Care Required",
            "description": "Prioritize rest, exercise, and preventive healthcare."
        }

    # ---------------- Personal Growth ----------------
    if head == "Strong":
        growth = {
            "trend": "High",
            "description": "Excellent learning ability and decision-making will support continuous personal development."
        }

    elif head == "Moderate":
        growth = {
            "trend": "Steady",
            "description": "Continue learning and developing new skills for long-term success."
        }

    else:
        growth = {
            "trend": "Improvement Needed",
            "description": "Practice focus, mindfulness, and structured learning."
        }

    trends["career"] = career
    trends["relationships"] = relationship
    trends["health"] = health
    trends["personal_growth"] = growth

    return trends