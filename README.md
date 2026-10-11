# Score MAMÁ Web

Sitio público e independiente para presentar la aplicación Score MAMÁ 2025.

## Seguridad del repositorio

Este proyecto contiene únicamente archivos estáticos y capturas promocionales. No contiene el código de la aplicación móvil, bases de datos clínicas, el PDF del protocolo ni credenciales. `app-version.json` contiene únicamente el manifiesto público para avisos opcionales de actualización.

## Desarrollo local

```bash
python3 -m http.server 8768 --bind 0.0.0.0
```

Abrir con la IP del equipo dentro de la red, por ejemplo `http://192.168.18.20:8768/`.

## App Store

La aplicación está disponible en [App Store](https://apps.apple.com/ec/app/score-mama-2025/id6772249435?l=en-GB).

## Guía de uso y versiones

`guia.html` documenta atenciones, evolución, pendientes, reevaluaciones, Share, exportación y búsqueda. Usa capturas de demostración; no recibe datos del paciente ni consultas clínicas. La página documenta la versión preparada 1.5.1+19 y distingue su disponibilidad de la versión de tienda. Antes de publicar una nueva versión, revisar la ficha de tienda y actualizar los avisos visibles del inicio y la guía. No activar `app-version.json` solo porque exista una compilación local.

## Validación

```sh
python3 validation/check-site.py
node --check script.js
```

`validation/check-browser.cjs` usa Playwright disponible en el equipo de validación; no es una dependencia del sitio. Ejecutarlo con `PREVIEW_BASE_URL` e indicar `BROWSER_EXECUTABLE` si el Chromium disponible difiere del predeterminado de Playwright. Las capturas y el resultado se guardan en `validation/`.

Origen y revisión de las capturas: [SCREENSHOTS.md](SCREENSHOTS.md).
