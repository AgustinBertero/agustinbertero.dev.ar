---
name: gdpr-review
description: Revisión técnica de protección de datos (RGPD, LOPDGDD, LSSI y Ley 25.326) de un proyecto o feature del portfolio. Inventario de datos personales, base legal, derechos de acceso, supresión y portabilidad, conservación, logs, envío de datos a proveedores de IA, cookies y seguridad. Genera docs/privacy-review.md. Usar cuando un proyecto guarde o procese datos de personas (login, formularios, logs, IA, analítica, cookies, integraciones) y siempre antes de marcarlo como live.
---

# Revisión de protección de datos

Esto es una revisión técnica, no un dictamen. Agustin es abogado y decide lo jurídico: marcá como **"a validar"** todo lo que dependa de interpretación legal y no lo des por resuelto.

## Marco

- **RGPD** (Reglamento (UE) 2016/679): referencia principal.
- **España:** LOPDGDD (Ley Orgánica 3/2018) y LSSI (Ley 34/2002), art. 22.2 para cookies. Autoridad: AEPD.
- **Argentina:** Ley 25.326 y Decreto 1558/2001. Autoridad: AAIP.

## Proceso

1. **Inventario.** Leé modelos, migraciones, formularios, jobs, logs y llamadas a terceros. Armá la tabla del informe con cada dato personal: de quién es, dónde se guarda, para qué, cuánto tiempo, quién accede y si sale a un tercero. Incluí lo que se suele olvidar: IPs y user agents en logs, emails en jobs fallidos, adjuntos, prompts enviados a la IA, cachés, índices de búsqueda y backups.
2. **Checklist.** Recorré todas las secciones de abajo contra el código, no contra la intención.
3. **Informe** en `projects/<slug>/docs/privacy-review.md`, con el formato del final y en inglés, como el resto del repo.
4. **Bloqueo.** Con un hallazgo de severidad alta abierto, el proyecto no pasa a `live`, salvo que yo acepte el riesgo por escrito en "Accepted decisions".

## Checklist

### Principios y base legal (arts. 5, 6, 7, 9 y 10)
- Cada dato tiene una finalidad concreta; nada "por si acaso" (minimización, art. 5.1.c).
- Base legal identificada para cada tratamiento (art. 6.1). Si es consentimiento: libre, específico, informado, inequívoco y tan fácil de retirar como de dar (arts. 4.11 y 7).
- Categorías especiales (art. 9) o datos sobre condenas e infracciones penales (art. 10): riesgo alto. En un SaaS jurídico aparecen casi seguro, y además hay secreto profesional.

### Información (arts. 13 y 14)
- Aviso de privacidad enlazado desde el registro, el login y cada formulario que recoge datos.

### Derechos (arts. 15 a 22)
- Acceso y portabilidad: el usuario descarga sus datos en formato estructurado (JSON o CSV). Tiene que ser una función real, no un proceso manual.
- Supresión: borrado en cascada, incluidos archivos en almacenamiento, colas, cachés e índices. Documentá qué pasa con los backups (caducan por rotación).
- Rectificación desde el perfil del usuario.
- Oposición y limitación, si hay tratamientos basados en interés legítimo o elaboración de perfiles.

### Conservación (art. 5.1.e)
- Plazo por tipo de dato y una tarea programada que lo cumple (en Laravel: `Prunable` + scheduler).
- Logs con rotación y plazo definido. Sin contraseñas, tokens, cuerpos de request ni contenido de formularios; emails enmascarados.
- Las IP son datos personales (TJUE, asunto C-582/14, Breyer): plazo corto o truncadas.

### Seguridad y privacidad desde el diseño (arts. 25 y 32)
- Cifrado en tránsito (Cloudflare + túnel) y en reposo para campos sensibles (en Laravel, casts `encrypted`).
- Roles y mínimo privilegio. En multi-tenant, tests que demuestren que un tenant no puede leer datos de otro.
- Registro de auditoría de accesos a datos personales (quién, qué, cuándo), sin posibilidad de edición desde la app.
- Valores por defecto más privados (art. 25.2): perfiles no públicos, opciones no esenciales desactivadas.
- Contraseñas con bcrypt o argon2, rate limit de login y 2FA si el riesgo lo justifica.

### Terceros y transferencias (arts. 28 y 44 a 49)
- Lista de proveedores que reciben datos (IA, email, almacenamiento, analítica), con su rol de encargado, país y garantía para la transferencia (decisión de adecuación o cláusulas contractuales tipo).
- **IA:** no enviar datos personales si no hace falta. Si hace falta, seudonimizar antes (reemplazar nombres, emails y teléfonos por tokens) y reidentificar en el backend. Proveedor sin retención ni entrenamiento con los datos. Documentarlo en el informe.

### Cookies y analítica (LSSI art. 22.2; Directiva 2002/58/CE art. 5.3)
- Sin consentimiento, solo cookies técnicas estrictamente necesarias (sesión, CSRF).
- Analítica: mejor sin cookies y self-hosted (Umami). Si hay cookies no técnicas o terceros, banner previo con "Rechazar" tan visible como "Aceptar".
- Fuentes y scripts self-hosted: cargar recursos de terceros les envía la IP del visitante.

### Brechas (arts. 33 y 34)
- Cómo se detectaría una brecha (logs, alertas) y un procedimiento escrito: notificación a la autoridad en 72 horas cuando corresponda, y a los afectados si el riesgo es alto.

### Registro y evaluación de impacto (arts. 30 y 35)
- Registro de actividades de tratamiento (puede ser la tabla de inventario del informe).
- Si hay datos de los arts. 9 o 10 a gran escala, perfiles o vigilancia sistemática: valorar una EIPD (art. 35), marcada como "a validar".

### Demo pública
- Solo datos sintéticos, aviso visible de no introducir datos reales y reset nocturno.
- Si aun así alguien introduce datos reales, el reset los elimina: confirmalo en el código del reset.

## Formato del informe

````markdown
# Privacy review — <Project name>

Date: YYYY-MM-DD · Scope: <project or feature> · Status: <open / closed>

## Summary
<3–5 lines: what personal data is processed, main risks, verdict.>

## Data inventory
| Data | Subject | Stored in | Purpose | Legal basis | Retention | Access | Third parties |
|---|---|---|---|---|---|---|---|

## Findings
| ID | Severity | Area | Finding | Reference | Action | Status |
|---|---|---|---|---|---|---|
| P-01 | High | Retention | ... | GDPR art. 5(1)(e) | ... | Open |

## Accepted decisions
- <Decision, reason, who accepted it and when.>

## To validate (legal)
- <Open legal questions for Agustin.>
````
