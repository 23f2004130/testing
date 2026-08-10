import json
import random

with open("app/data/tarot_cards.json", "r", encoding="utf-8") as f:
    TAROT_CARDS = json.load(f)

def draw_random_card():

    card = random.choice(TAROT_CARDS)

    orientation = random.choice(["Upright", "Reversed"])

    if orientation == "Reversed":
        card_data = {
            "name": card["name"],
            "image": card["image"],
            "orientation": orientation,
            "meaning": card["reversed"]["meaning"],
            "love": card["reversed"]["love"],
            "career": card["reversed"]["career"],
            "health": card["reversed"]["health"]
        }
    else:
        card_data = {
            "name": card["name"],
            "image": card["image"],
            "orientation": orientation,
            "meaning": card["meaning"],
            "love": card["love"],
            "career": card["career"],
            "health": card["health"]
        }

    return card_data