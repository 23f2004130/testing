from app.ai.llm_service import generate_ai_reading


def generate_interpretation(
    classification,
    finger_analysis,
    line_analysis
):
    structured_analysis = {
        "classification": classification,
        "finger_analysis": finger_analysis,
        "line_analysis": line_analysis
    }

    ai_reading = generate_ai_reading(structured_analysis)
    interpretation = "AI interpretation skipped during testing."
    return {
        "structured_analysis": structured_analysis,
        "ai_reading": ai_reading
    }