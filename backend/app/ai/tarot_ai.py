from ollama import chat

def generate_tarot_reading(card):
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
    response = chat(
        model="llama3.2:1b",
        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ]
    )

    return response["message"]["content"]