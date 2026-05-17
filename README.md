# Summer Manga Quest · Kike

Web estática para GitHub Pages que organiza una ruta de dibujo del 27 de mayo al 31 de agosto de 2026.

## Qué incluye

- Ruta por 8 arcos.
- Misión diaria con modos de 15, 45 y 90 minutos.
- Calendario de progreso.
- Galería local de dibujos mediante IndexedDB.
- Generador de prompt semanal para evaluación con IA.
- Biblioteca de recursos.
- Exportación/importación del progreso textual en JSON.
- Vista imprimible para guardar como PDF desde el navegador.

## Privacidad

No tiene servidor, login, analíticas ni formularios externos. El progreso se guarda en el navegador con `localStorage`. Las imágenes se guardan localmente en el navegador mediante `IndexedDB`.

## Publicación en GitHub Pages

1. Crea un repositorio llamado `kike-manga-quest`.
2. Sube estos archivos a la raíz del repositorio:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. En GitHub: `Settings → Pages`.
4. Source: `Deploy from a branch`.
5. Branch: `main`; folder: `/root`.
6. Guarda.
7. La web quedará en una URL similar a:
   `https://TU_USUARIO.github.io/kike-manga-quest/`

## Nota sobre imágenes de referencia

Conviene no subir imágenes oficiales de manga a una web pública. La app está pensada para mostrar los dibujos propios de Kike y enlazar recursos externos.
