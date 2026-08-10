from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import os

OUTPUT_FOLDER = "reports"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def generate_report(reading):
    filename = os.path.join(
        OUTPUT_FOLDER,
        f"Palm_Report_{reading.id}.pdf"
    )

    doc = SimpleDocTemplate(filename)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("<b>Palm Reading Report</b>", styles["Heading1"]))
    story.append(Paragraph(f"Reading ID: {reading.id}", styles["BodyText"]))
    story.append(Paragraph(f"Palm Shape: {reading.classification}", styles["BodyText"]))
    story.append(Paragraph(f"Finger Analysis: {reading.finger_analysis}", styles["BodyText"]))
    story.append(Paragraph(f"Line Analysis: {reading.line_analysis}", styles["BodyText"]))
    story.append(Paragraph(f"Interpretation: {reading.interpretation}", styles["BodyText"]))

    doc.build(story)

    return filename