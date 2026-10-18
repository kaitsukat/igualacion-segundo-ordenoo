# Igualación a la muestra de segundo orden

Tarea interactiva con cinco pruebas (adquisición base y cuatro transferencias) que registra aciertos y tiempos de respuesta por ensayo.

- `index.html`: la página que ven los participantes.
- `Codigo.gs`: script de Google Apps Script que recibe los datos en una hoja de Google Sheets (no se usa en el sitio; se pega en Apps Script).

## Antes de publicar
En `index.html`, al inicio del bloque `<script>`, edita:
- `ENDPOINT`: la URL de tu aplicación web de Apps Script (termina en `/exec`).
- `CONSENT_TEXT`: el texto de consentimiento de tu protocolo.

## Publicar con GitHub Pages
1. Settings > Pages.
2. En Source elige "Deploy from a branch", rama `main`, carpeta `/ (root)`. Guarda.
3. Espera uno o dos minutos. El enlace será `https://TU-USUARIO.github.io/igualacion-segundo-orden/`.
