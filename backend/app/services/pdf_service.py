import os
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image
)

from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet


REPORT_FOLDER = "app/reports"
os.makedirs(REPORT_FOLDER, exist_ok=True)

def generate_report(reading):

    filename = f"reading_{reading.id}.pdf"

    filepath = os.path.join(REPORT_FOLDER, filename)

    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(filepath)

    story = []

    # ====================================
    # Title
    # ====================================

    story.append(
        Paragraph(
            "<b><font size=20>Palmistry AI Analysis Report</font></b>",
            styles["Title"]
        )
    )

    story.append(Spacer(1, 20))

    # ====================================
    # Reading Information
    # ====================================

    story.append(
        Paragraph(
            "<b>Reading Information</b>",
            styles["Heading1"]
        )
    )

    info_table = Table([
        ["Reading ID", str(reading.id)],
        ["Palm Shape", reading.palm_shape],
        ["Longest Finger", reading.longest_finger],
        ["Shortest Finger", reading.shortest_finger],
        ["Created At", str(reading.created_at)]
    ])

    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica")
    ]))

    story.append(info_table)

    story.append(Spacer(1, 20))

    # ====================================
    # Original Image
    # ====================================

    if hasattr(reading, "original_image"):

        image_path = os.path.join(
            "app/uploads",
            reading.original_image
        )

        if os.path.exists(image_path):

            story.append(
                Paragraph(
                    "<b>Original Palm Image</b>",
                    styles["Heading2"]
                )
            )

            story.append(
                Image(
                    image_path,
                    width=3 * inch,
                    height=3 * inch
                )
            )

            story.append(Spacer(1, 15))

    # ====================================
    # Processed Image
    # ====================================

    if hasattr(reading, "processed_image"):

        processed_path = os.path.join(
            "app/uploads",
            reading.processed_image
        )

        if os.path.exists(processed_path):

            story.append(
                Paragraph(
                    "<b>Processed Palm Image</b>",
                    styles["Heading2"]
                )
            )

            story.append(
                Image(
                    processed_path,
                    width=3 * inch,
                    height=3 * inch
                )
            )

            story.append(Spacer(1, 15))

    # ====================================
    # Line Detection Image
    # ====================================

    if hasattr(reading, "line_image"):

        line_path = os.path.join(
            "app/uploads",
            reading.line_image
        )

        if os.path.exists(line_path):

            story.append(
                Paragraph(
                    "<b>Detected Palm Lines</b>",
                    styles["Heading2"]
                )
            )

            story.append(
                Image(
                    line_path,
                    width=3 * inch,
                    height=3 * inch
                )
            )

            story.append(Spacer(1, 20))

    # ====================================
    # Classification
    # ====================================

    story.append(
        Paragraph(
            "<b>Palm Classification</b>",
            styles["Heading1"]
        )
    )

    class_table = Table([
        ["Palm Shape", reading.palm_shape],
        ["Longest Finger", reading.longest_finger],
        ["Shortest Finger", reading.shortest_finger]
    ])

    class_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(class_table)

    story.append(Spacer(1, 20))

    # ====================================
    # Finger Analysis
    # ====================================

    if hasattr(reading, "finger_analysis") and reading.finger_analysis:

        story.append(
            Paragraph(
                "<b>Finger Analysis</b>",
                styles["Heading1"]
            )
        )

        for key, value in reading.finger_analysis.items():

            story.append(
                Paragraph(
                    f"<b>{key.title()}</b>: {value}",
                    styles["Normal"]
                )
            )

        story.append(Spacer(1, 20))

    # ====================================
    # Line Analysis
    # ====================================

    if hasattr(reading, "line_analysis") and reading.line_analysis:

        story.append(
            Paragraph(
                "<b>Line Analysis</b>",
                styles["Heading1"]
            )
        )

        for key, value in reading.line_analysis.items():

            story.append(
                Paragraph(
                    f"<b>{key.title()}</b>: {value}",
                    styles["Normal"]
                )
            )

        story.append(Spacer(1, 20))

    # ====================================
    # AI Interpretation
    # ====================================

    story.append(
        Paragraph(
            "<b>AI Interpretation</b>",
            styles["Heading1"]
        )
    )

    ai_text = (
        reading.interpretation
        .replace("**", "")
        .replace("\n", "<br/>")
    )

    story.append(
        Paragraph(
            ai_text,
            styles["BodyText"]
        )
    )

    story.append(Spacer(1, 30))

    # ====================================
    # Footer
    # ====================================

    story.append(
        Paragraph(
            "<font size=10><i>"
            "Generated by Palmistry & Tarot Intelligence Platform"
            "</i></font>",
            styles["Normal"]
        )
    )

    doc.build(story)

    return filepath
