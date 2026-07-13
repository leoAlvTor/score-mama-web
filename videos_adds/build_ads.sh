#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/videos_adds"
OUTPUT="$SOURCE/exportados"
ICON="$ROOT/assets/brand/score-mama-app-icon.png"

mkdir -p "$OUTPUT"

build_ad() {
  local input="$1"
  local output="$2"
  local title="$3"
  local subtitle="$4"
  local overlay="$5"
  local max_duration="$6"
  local cards="$OUTPUT/.cards-${output%.mp4}"

  python3 "$SOURCE/render_cards.py" "$title" "$subtitle" "$overlay" "$ICON" "$cards"

  ffmpeg -y -hide_banner -loglevel error \
    -i "$SOURCE/$input" -loop 1 -i "$cards/banner.png" -loop 1 -i "$cards/intro.png" -loop 1 -i "$cards/outro.png" \
    -filter_complex "
      [2:v]fps=30,trim=duration=1.8,setpts=PTS-STARTPTS[intro_ready];
      [0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,
        fps=30,trim=duration=$max_duration,setpts=PTS-STARTPTS[demo_base];
      [1:v]fps=30,trim=duration=$max_duration,setpts=PTS-STARTPTS[banner];
      [demo_base][banner]overlay=0:0:shortest=1[demo];
      [3:v]fps=30,trim=duration=2.7,setpts=PTS-STARTPTS[outro_ready];
      [intro_ready][demo][outro_ready]concat=n=3:v=1:a=0,format=yuv420p[v]
    " \
    -map "[v]" -an -c:v libx264 -preset medium -crf 20 -movflags +faststart "$OUTPUT/$output"

  rm -rf "$cards"
}

build_ad "calculo_score_mama.mov" "01_calculo_score_mama.mp4" \
  "Del valor al Score MAMÁ" "Cálculo claro y desglosado" \
  "Registra, calcula y revisa cada parámetro" 28.1

build_ad "claves_obstetricas_y_busqueda_inteligente.mov" "02_busqueda_trazable.mp4" \
  "Encuentra y comprueba" "Búsqueda dentro del protocolo" \
  "De la coincidencia a la página fuente" 25.7

build_ad "calculo_por_voz.mov" "03_calculo_por_voz.mp4" \
  "Dicta. Revisa. Confirma." "Ingreso por voz revisable" \
  "Los valores se revisan antes de calcular" 25.6

build_ad "herramientas_clinicas.mov" "04_herramientas_clinicas.mp4" \
  "Herramientas clínicas" "Fórmulas y unidades visibles" \
  "Cálculos deterministas basados en el protocolo" 15.4

build_ad "manejo_historial.mov" "05_historial.mp4" \
  "Consulta el historial" "Resultados organizados localmente" \
  "Revisa evaluaciones y su desglose" 19.2

build_ad "manejo_reevaluaciones.mov" "06_reevaluaciones.mp4" \
  "Organiza reevaluaciones" "Seguimiento sin perder el contexto" \
  "Reevalúa, completa o exporta el registro" 9

echo "Anuncios exportados en: $OUTPUT"
