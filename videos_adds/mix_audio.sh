#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEOS="$ROOT/videos_adds/exportados"
AUDIOS="$ROOT/audios"
OUTPUT="$ROOT/videos_adds/exportados_con_audio"

mkdir -p "$OUTPUT"

mix() {
  local video="$1"
  local audio="$2"
  local delay_ms="$3"
  local tempo="${4:-1.0}"
  local duration
  duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEOS/$video")"

  ffmpeg -y -hide_banner -loglevel error \
    -i "$VIDEOS/$video" -i "$AUDIOS/$audio" \
    -filter_complex "[1:a]atempo=$tempo,loudnorm=I=-16:TP=-1.5:LRA=11,adelay=${delay_ms}:all=1,apad[a]" \
    -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 \
    -t "$duration" -movflags +faststart "$OUTPUT/$video"
}

mix "01_calculo_score_mama.mp4" "01_audio.mp3" 1800
mix "02_busqueda_trazable.mp4" "02_audio.mp3" 1800
mix "03_calculo_por_voz.mp4" "03_audio.mp3" 1800
mix "04_herramientas_clinicas.mp4" "04_audio.mp3" 1800
mix "05_historial.mp4" "05_audio.mp3" 1800
mix "06_reevaluaciones.mp4" "06_audio.mp3" 800 1.08

echo "Videos narrados exportados en: $OUTPUT"
