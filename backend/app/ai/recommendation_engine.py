def generate_recommendations(
    classification,
    finger_analysis,
    line_analysis
):

    recommendations = []

    # Palm Shape
    palm = classification.get("palm_shape")

    if palm == "Earth":
        recommendations.append({
            "category": "Career",
            "message": "Use your practical nature to excel in structured environments."
        })

    elif palm == "Fire":
        recommendations.append({
            "category": "Career",
            "message": "Channel your energy into leadership and innovation."
        })

    elif palm == "Air":
        recommendations.append({
            "category": "Career",
            "message": "Your communication skills are your greatest strength."
        })

    elif palm == "Water":
        recommendations.append({
            "category": "Career",
            "message": "Creative and people-oriented careers suit you well."
        })

    # Heart Line
    heart = line_analysis.get("heart_line", {}).get("status")

    if heart == "Weak":
        recommendations.append({
            "category": "Relationships",
            "message": "Spend quality time with loved ones and communicate openly."
        })

    elif heart == "Strong":
        recommendations.append({
            "category": "Relationships",
            "message": "Your emotional intelligence is a strength. Continue nurturing meaningful relationships."
        })

    # Head Line
    head = line_analysis.get("head_line", {}).get("status")

    if head == "Weak":
        recommendations.append({
            "category": "Personal Growth",
            "message": "Practice meditation and focus exercises to improve concentration."
        })

    else:
        recommendations.append({
            "category": "Personal Growth",
            "message": "Continue challenging yourself with new learning opportunities."
        })

    # Life Line
    life = line_analysis.get("life_line", {}).get("status")

    if life == "Weak":
        recommendations.append({
            "category": "Health",
            "message": "Prioritize regular exercise, good sleep, and stress management."
        })

    else:
        recommendations.append({
            "category": "Health",
            "message": "Maintain your healthy lifestyle with regular physical activity."
        })

    return recommendations