from fastapi import APIRouter
from app.data.tarot_cards import draw_random_card
from app.ai.tarot_ai import generate_tarot_reading

router = APIRouter(prefix="/tarot", tags=["Tarot"])


@router.get("/draw")
def draw_card():

    card = draw_random_card()

    interpretation = generate_tarot_reading(card)

    return {
        "card": card["name"],
        "meaning": card["meaning"],
        "image": card["image"],
        "interpretation": interpretation
    }