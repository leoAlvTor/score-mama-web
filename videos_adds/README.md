# Videos publicitarios

Los archivos originales `.mov` se conservan sin modificaciones. Las versiones finales se generan en `exportados/` en formato vertical 1080 × 1920, H.264 y sin música, listas para Reels, TikTok y YouTube Shorts.

Orden sugerido de publicación:

1. Búsqueda trazable.
2. Cálculo de Score MAMÁ.
3. Claves y herramientas clínicas.
4. Ingreso por voz revisable.
5. Historial y reevaluaciones.

Los videos presentan funciones reales de la aplicación y evitan promesas diagnósticas o terapéuticas.

`mix_audio.sh` normaliza las narraciones a −16 LUFS, agrega los silencios de entrada correspondientes y genera las versiones narradas dentro de `exportados_con_audio/`.

`optimize_data_entry.sh` crea versiones especiales de los anuncios 01 y 03: acelera únicamente la captura repetitiva de datos y mantiene los resultados visibles para sincronizarlos con la narración.
