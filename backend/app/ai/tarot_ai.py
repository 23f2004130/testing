import socket
from ollama import chat

def is_ollama_online(host="127.0.0.1", port=11434, timeout=0.3):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False

def generate_tarot_reading(card):
    if not is_ollama_online():
        name = card.get("name", "Tarot Card")
        orientation = card.get("orientation", "Upright")
        meaning = card.get("meaning", "New opportunities and growth ahead.")
        return (
            f"The {name} ({orientation}) brings a strong message of clarity and transformation. "
            f"Key guidance: {meaning} Trust your inner wisdom and take intentional steps forward."
        )

    prompt = f"""
You are an experienced Tarot Reader.

Card: {card["name"]}

Orientation: {card["orientation"]}

Meaning:
{card["meaning"]}

Love:
{card["love"]}

Career:
{card["career"]}

Health:
{card["health"]}

Generate an encouraging and personalized tarot reading.

Keep it under 180 words.
"""
    try:
        response = chat(
            model="llama3.2:1b",
            messages=[
                {
                    "role":"user",
                    "content":prompt
                }
            ],
            options={"temperature": 0.5, "num_predict": 200}
        )
        return response["message"]["content"]
    except Exception:
        name = card.get("name", "Tarot Card")
        orientation = card.get("orientation", "Upright")
        meaning = card.get("meaning", "Wisdom and renewed focus.")
        return f"The {name} ({orientation}) indicates: {meaning} Proceed with confidence."