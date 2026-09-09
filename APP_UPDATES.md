# Avisos de actualización de Score MAMÁ

La app consulta `https://leoalvtor.github.io/score-mama-web/app-version.json`
como máximo una vez cada 24 horas. No envía datos clínicos ni identificadores
de paciente. Como en cualquier petición web, el alojamiento recibe los datos
técnicos normales de conexión (por ejemplo la dirección IP).

## Estado inicial

Ambas plataformas están desactivadas (`enabled: false`). `1.5.0` y `14`
corresponden al código local preparado, NO certifican publicación en tiendas.
La primera versión que incluya el lector podrá recibir futuros avisos.
Las versiones anteriores que no tengan esta funcionalidad no pueden mostrarlos.

## Publicar una actualización

1. Preparar y probar la versión de la app. Procurar la misma versión comercial
   para Android e iOS; los números de compilación pueden ser distintos.
2. Esperar a que la versión esté disponible para los usuarios destinatarios en
   la tienda correspondiente. No activar por una aprobación pendiente, beta o
   una publicación gradual que aún no incluya a todos los destinatarios.
3. Editar SOLO el bloque de esa plataforma en `app-version.json`:
   - `version`: versión de tres números, por ejemplo `1.6.0`.
   - `build`: número de compilación como texto, por ejemplo `15`.
   - `enabled`: `true`.
4. Guardar en `main`, esperar el despliegue de Pages y abrir la URL pública para
   verificar el JSON publicado. La caché puede demorar la propagación.
5. Repetir para la otra plataforma cuando su tienda esté lista.

No añadir enlaces, HTML, identificadores de pacientes ni información clínica.
Los enlaces de App Store y Google Play están fijados en la aplicación.

## Desactivar un aviso

Cambiar `enabled` a `false` en la plataforma afectada. Los clientes lo verán en
su siguiente consulta; no es un interruptor de emergencia instantáneo.
No se fuerza una actualización ni se descarga código desde GitHub.

## Comportamiento de la app

- Compara versión y compilación numéricamente; nunca propone bajar de versión.
- Aviso opcional en Historial y Configuración, no sobre formularios clínicos.
- “Más tarde” lo oculta durante tres días para esa versión.
- Sin conexión o con configuración inválida, la app sigue funcionando.
- El archivo no requiere migración de la base de datos.
- GitHub Pages publica este archivo de forma pública: no guardar secretos.

## Comprobación local

`python3 -m json.tool app-version.json`

También ejecutar las pruebas `app_update_service_test.dart` y
`app_update_notice_test.dart` del proyecto Flutter antes de publicar el lector.
