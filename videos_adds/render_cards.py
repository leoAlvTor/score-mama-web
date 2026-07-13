#!/usr/bin/env python3
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

title, subtitle, overlay, icon_path, output_dir = sys.argv[1:]
output = Path(output_dir)
output.mkdir(parents=True, exist_ok=True)

bold = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
regular = "/System/Library/Fonts/Supplemental/Arial.ttf"
blue = "#08162c"
light_blue = "#afcbff"

def font(path, size):
    return ImageFont.truetype(path, size)

def centered(draw, text, y, face, fill):
    box = draw.textbbox((0, 0), text, font=face)
    draw.text(((1080 - (box[2] - box[0])) / 2, y), text, font=face, fill=fill)

icon = Image.open(icon_path).convert("RGBA")

intro = Image.new("RGB", (1080, 1920), blue)
intro.paste(icon.resize((250, 250), Image.Resampling.LANCZOS), (415, 430), icon.resize((250, 250), Image.Resampling.LANCZOS))
draw = ImageDraw.Draw(intro)
centered(draw, title, 760, font(bold, 66), "white")
centered(draw, subtitle, 860, font(bold, 38), light_blue)
intro.save(output / "intro.png")

banner = Image.new("RGBA", (1080, 190), (8, 22, 44, 240))
draw = ImageDraw.Draw(banner)
centered(draw, overlay, 75, font(bold, 42), "white")
banner.save(output / "banner.png")

outro = Image.new("RGB", (1080, 1920), blue)
outro_icon = icon.resize((230, 230), Image.Resampling.LANCZOS)
outro.paste(outro_icon, (425, 360), outro_icon)
draw = ImageDraw.Draw(outro)
centered(draw, "Score MAMÁ 2025", 690, font(bold, 70), "white")
centered(draw, "Consulta. Calcula. Verifica la fuente.", 805, font(regular, 36), light_blue)
draw.rounded_rectangle((220, 930, 860, 1060), radius=24, fill="#2563eb")
centered(draw, "Disponible en App Store", 966, font(bold, 43), "white")
outro.save(output / "outro.png")
