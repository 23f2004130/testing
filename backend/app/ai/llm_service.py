import socket
from ollama import chat

def is_ollama_online(host="127.0.0.1", port=11434, timeout=0.3):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False

def generate_ai_reading(data):
    # Fast fallback if Ollama server is not running
    if not is_ollama_online():
        cls = data.get("classification", {})
        palm_shape = cls.get("palm_shape", "Balanced")
        finger_type = cls.get("finger_type", "Proportional")
        f_analysis = data.get("finger_analysis", {})
        longest = f_analysis.get("longest_finger", "Middle")

        return (
            f"**Personality**\n"
            f"Your {palm_shape} palm and {finger_type} fingers show an energetic, creative, and intuitive nature. "
            f"You possess strong mental clarity and take initiative when inspired.\n\n"
            f"**Career**\n"
            f"With your {longest} finger as a key focal point, you thrive in dynamic roles where leadership, strategic decision-making, and self-direction are valued.\n\n"
            f"**Relationships**\n"
            f"Warm and loyal in close bonds. You appreciate open, honest communication and mutual respect in partnerships.\n\n"
            f"**Health**\n"
            f"Good overall vitality. Maintain consistent hydration and balance active periods with restful recovery.\n\n"
            f"**Strengths**\n"
            f"Resilience, quick adaptability, high determination, and strategic insight.\n\n"
            f"**Suggestions**\n"
            f"Trust your creative intuition and cultivate daily routines that support sustainable focus."
        )

    prompt = f"""
You are a professional palmistry assistant.

Based ONLY on the following analysis:

Palm Shape:
{data["classification"]}

Finger Analysis:
{data["finger_analysis"]}

Palm Lines:
{data["line_analysis"]}

Generate a concise palm reading with these sections:

1. Personality
2. Career
3. Relationships
4. Health
5. Strengths
6. Suggestions

Rules:
- Maximum 250 words.
- Use simple, friendly English.
- Do not repeat the numerical values.
- Do not make supernatural or guaranteed predictions.
- Base every statement only on the provided analysis.
"""
    try:
        response = chat(
            model="llama3.2:1b",
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.4, "num_predict": 300}
        )
        return response["message"]["content"]
    except Exception:
        cls = data.get("classification", {})
        palm_shape = cls.get("palm_shape", "Balanced")
        return (
            f"**Personality**\n"
            f"Your {palm_shape} palm indicates strong emotional resilience and natural adaptability.\n\n"
            f"**Career**\n"
            f"Strategic focus and self-reliance lead to steady advancement in ambitious endeavors.\n\n"
            f"**Relationships**\n"
            f"Loyal and perceptive, valuing long-term trust and genuine connection.\n\n"
            f"**Health**\n"
            f"Consistent energy flow. Ensure balanced rest and physical activity.\n\n"
            f"**Strengths**\n"
            f"Intuition, clarity, and perseverance.\n\n"
            f"**Suggestions**\n"
            f"Balance your strong drive with mindful mindfulness and regular recharging."
        )