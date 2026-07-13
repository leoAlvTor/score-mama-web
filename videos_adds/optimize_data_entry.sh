#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEOS="$ROOT/videos_adds/exportados"
AUDIOS="$ROOT/audios"
OUTPUT="$ROOT/videos_adds/exportados_con_audio/ajustados"

mkdir -p "$OUTPUT"

# Cálculo manual: mantiene el comienzo, acelera 4× la escritura repetitiva,
# conserva el resultado a velocidad normal y extiende suavemente su último cuadro.
ffmpeg -y -hide_banner -loglevel error \
  -i "$VIDEOS/01_calculo_score_mama.mp4" -i "$AUDIOS/01_audio.mp3" \
  -filter_complex "
    [0:v]trim=0:4.8,setpts=PTS-STARTPTS[v0];
    [0:v]trim=4.8:21.8,setpts=(PTS-STARTPTS)/4[v1];
    [0:v]trim=21.8:28.5,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=6.4[v2];
    [0:v]trim=29.9:32.6,setpts=PTS-STARTPTS[v3];
    [v0][v1][v2][v3]concat=n=4:v=1:a=0,fps=30,format=yuv420p[v];
    [1:a]atempo=1.05,loudnorm=I=-16:TP=-1.5:LRA=11,adelay=1000:all=1,apad[a]
  " \
  -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 20 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart \
  "$OUTPUT/01_calculo_score_mama.mp4"

# Dictado: acelera 3× sólo la espera de grabación/transcripción. La pantalla
# con los valores aplicados se mantiene para que pueda leerse con la narración.
ffmpeg -y -hide_banner -loglevel error \
  -i "$VIDEOS/03_calculo_por_voz.mp4" -i "$AUDIOS/03_audio.mp3" \
  -filter_complex "
    [0:v]trim=0:4.8,setpts=PTS-STARTPTS[v0];
    [0:v]trim=4.8:22.8,setpts=(PTS-STARTPTS)/3[v1];
    [0:v]trim=22.8:27.4,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=5[v2];
    [0:v]trim=27.4:30.1,setpts=PTS-STARTPTS[v3];
    [v0][v1][v2][v3]concat=n=4:v=1:a=0,fps=30,format=yuv420p[v];
    [1:a]loudnorm=I=-16:TP=-1.5:LRA=11,adelay=1500:all=1,apad[a]
  " \
  -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 20 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart \
  "$OUTPUT/03_calculo_por_voz.mp4"

echo "Videos ajustados en: $OUTPUT"
