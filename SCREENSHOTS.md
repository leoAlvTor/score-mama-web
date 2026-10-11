# Capturas de demostración y revisión

Guía documentada: app preparada **1.5.1+19**, 11 de octubre de 2026. App Store comprobada mediante Apple Lookup: **1.4**. Inicio y guía indican que las nuevas funciones pueden no estar disponibles todavía en la descarga pública. El manifiesto de avisos no se activa.

Las catorce imágenes de `assets/guide/` se generaron desde los widgets de la aplicación y la validación del lector. No se reconstruyeron pantallas con HTML ni se retocaron cifras o textos. Se exportaron a WebP, calidad 88, con dimensiones explícitas y carga diferida. El conjunto pesa menos de 1 MB.

| Captura | Origen y datos |
| --- | --- |
| `atencion-resumen`, `atencion-evolucion`, `atencion-registros` | ClinicalCaseDetailPage; tres evaluaciones ficticias de «Ejemplo ficticio 01», 11/10/2026, 09:00–10:00. |
| `atencion-pendientes`, `atencion-nuevo-pendiente` | ClinicalActionsPanel; acción «Comunicar al equipo · ejemplo» y reevaluación ficticia. |
| `atencion-compartir` | AttentionShareSheet sobre la misma atención ficticia. |
| `atencion-exportar` | Diálogo real requestExportIdentity; campos opcionales vacíos. |
| `atencion-evolucion-oscuro` | ClinicalCaseDetailPage en tema oscuro; mismos datos ficticios. |
| `busqueda-pregunta`, `busqueda-resultados`, `busqueda-oscuro` | ProtocolLibraryScreen; consultas de demostración, sin información de pacientes. |
| `lectura-fragmento`, `lectura-tabla` | ProtocolReaderScreen; contenido del protocolo con controles de origen. |
| `pdf-origen` | PDF original, página 39, correspondiente al ejemplo de tabla. |

El motor de pruebas Flutter no tiene las fuentes del sistema iOS: para las capturas de atenciones se registró una fuente local con soporte del subíndice ₂. Se conservaron los widgets, datos, controles, colores y estructura de la app; las capturas no son una grabación física del iPhone.

## Verificaciones realizadas

- Prueba de captura de los widgets reales: aprobada, ocho capturas de atenciones.
- 47 pruebas existentes de detalle de atención, acciones y sesiones de transferencia: aprobadas. Las sesiones usan transportes de prueba; no constituyen una nueva prueba física entre dos teléfonos.
- Cinco páginas HTML y 120 referencias locales: archivos y anclas existentes; imágenes con alt y dimensiones.
- Navegador Chromium: anchos 390 y 1280, texto al 200 %, sin desbordamiento horizontal; guía sin JavaScript, ampliación y ajuste de imagen, cierre con Escape y retorno del foco.
- Movimiento reducido sin reproducción automática; video que baja del 70 % al 40 % de visibilidad se pausa.
- Revisión visual de capturas del inicio, guía, atenciones, pendientes, compartir y texto ampliado; subíndices y datos ficticios comprobados en las capturas de aplicación.
- `node --check script.js` y `git diff --check`: sin incidencias. `app-version.json` conserva su contenido original.

Para una publicación posterior: verificar nuevamente la versión de tienda, actualizar el aviso visible cuando corresponda y comprobar las URLs públicas después del despliegue de Pages. No anunciar disponibilidad pública basándose solo en estas capturas.
