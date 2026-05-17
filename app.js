const START = new Date('2026-05-27T00:00:00');
const END = new Date('2026-09-03T00:00:00');
const DAY = 24 * 60 * 60 * 1000;
const TOTAL_DAYS = Math.round((END - START) / DAY) + 1;

const arcs = [
  { id: 0, start: '2026-05-27', end: '2026-05-31', title: 'Despertar la mano', desc: 'Volver a dibujar sin presión: líneas, círculos, objetos sencillos de la mesa y una primera página de referencia.', milestone: '6 objetos copiados y una foto “punto de partida”.' },
  { id: 1, start: '2026-06-01', end: '2026-06-14', title: 'Objetos y formas simples', desc: 'Copiar tazas, cajas, botellas, libros, llaves, auriculares y comida. Aprender a simplificar antes de detallar.', milestone: 'Lámina de 20 objetos cotidianos.' },
  { id: 2, start: '2026-06-15', end: '2026-06-28', title: 'Volumen y perspectiva básica', desc: 'Transformar objetos en cajas, cilindros y esferas. Practicar estanterías, mesas, barriles y habitaciones sencillas.', milestone: 'Escena simple con objetos en profundidad.' },
  { id: 3, start: '2026-06-29', end: '2026-07-12', title: 'Detalle, textura y mundo visual', desc: 'Entrenar nubes, madera, metal, telas, carteles, comida, vegetación, cuerdas, mochilas y detalles de aventura.', milestone: 'Banco de 30 detalles dibujados.' },
  { id: 4, start: '2026-07-13', end: '2026-07-26', title: 'Personajes por piezas', desc: 'Entrar en personajes sin anatomía dura: cabezas simples, expresiones, manos básicas, siluetas y poses muy esquemáticas.', milestone: 'Hoja de expresiones y siluetas simples.' },
  { id: 5, start: '2026-07-27', end: '2026-08-09', title: 'Escenas donde pasan cosas', desc: 'Componer pequeñas escenas con varios elementos, acciones paralelas y detalles que cuenten algo.', milestone: 'Mini escena con 5 elementos o personajes con papeles distintos.' },
  { id: 6, start: '2026-08-10', end: '2026-08-23', title: 'Diseño del póster final', desc: 'Elegir formato, miniaturas, composición, foco principal, secundarios, objetos, detalles y rótulos japoneses.', milestone: 'Boceto completo del póster final.' },
  { id: 7, start: '2026-08-24', end: '2026-09-03', title: 'Final Boss', desc: 'Acabar el póster: línea final, detalles, color o sombreado, foto/escaneo y comparación con el primer día.', milestone: 'Póster final y galería de progreso.' }
];

const missions = [
  'Dibuja un objeto pequeño de la mesa usando solo líneas lentas.',
  'Dibuja tres versiones del mismo objeto: rápido, lento y corregido.',
  'Convierte un objeto en formas simples: caja, esfera, cilindro o cono.',
  'Copia un detalle pequeño de una imagen compleja: cartel, nube, comida, cuerda o accesorio.',
  'Dibuja una mini escena de objetos: tres cosas con tamaños distintos.',
  'Elige un dibujo anterior y repítelo un poco mejor.',
  'Día de revisión: marca 3 aciertos y 1 cosa para mañana.'
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const storage = {
  getProgress() { return JSON.parse(localStorage.getItem('kikeProgress') || '{}'); },
  setProgress(data) { localStorage.setItem('kikeProgress', JSON.stringify(data)); },
  getSettings() { return JSON.parse(localStorage.getItem('kikeSettings') || '{}'); },
  setSettings(data) { localStorage.setItem('kikeSettings', JSON.stringify(data)); }
};

function fmtDate(date) {
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function iso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCourseToday() {
  return iso(clampDate(new Date()));
}

function parseISO(str) {
  return new Date(str + 'T00:00:00');
}

function clampDate(date) {
  if (date < START) return START;
  if (date > END) return END;
  return date;
}

function getArcForDate(dateStr) {
  return arcs.find(a => dateStr >= a.start && dateStr <= a.end) || arcs[0];
}

function getDayIndex(dateStr) {
  return Math.round((parseISO(dateStr) - START) / DAY);
}

function getMissionForDate(dateStr) {
  const idx = getDayIndex(dateStr);
  return missions[((idx % missions.length) + missions.length) % missions.length];
}

function renderArcs() {
  const grid = $('#arcsGrid');
  const tpl = $('#arcTemplate');
  grid.innerHTML = '';

  arcs.forEach(arc => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.arc-num').textContent = `Arco ${arc.id}`;
    node.querySelector('.arc-dates').textContent = `${parseISO(arc.start).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · ${parseISO(arc.end).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
    node.querySelector('h3').textContent = arc.title;
    node.querySelector('p').textContent = arc.desc;
    node.querySelector('.milestone').textContent = arc.milestone;
    grid.appendChild(node);
  });
}

function setActiveTab(id) {
  $$('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === id));
  $$('.panel').forEach(p => p.classList.toggle('is-active', p.id === id));

  if (id === 'calendario') renderCalendar();
  if (id === 'galeria') loadGallery();
}

function loadDaily(dateStr) {
  const progress = storage.getProgress();
  const entry = progress[dateStr] || {};
  const arc = getArcForDate(dateStr);

  $('#entryDate').value = dateStr;
  $('#todayDate').textContent = fmtDate(parseISO(dateStr));
  $('#todayArc').textContent = `Arco ${arc.id}: ${arc.title}`;
  $('#todayTitle').textContent = getMissionForDate(dateStr);
  $('#todayDescription').textContent = arc.desc;

  $('#minutes').value = entry.minutes || '';
  $('#warmup').checked = !!entry.warmup;
  $('#exercise').checked = !!entry.exercise;
  $('#photo').checked = !!entry.photo;
  $('#notes').value = entry.notes || '';

  $$('.mode').forEach(btn => {
    btn.classList.toggle('is-active', Number(btn.dataset.minutes) === Number(entry.minutes));
  });
}

function saveDaily(event) {
  event.preventDefault();

  const dateStr = $('#entryDate').value;
  const progress = storage.getProgress();

  progress[dateStr] = {
    minutes: Number($('#minutes').value || 0),
    warmup: $('#warmup').checked,
    exercise: $('#exercise').checked,
    photo: $('#photo').checked,
    notes: $('#notes').value.trim(),
    savedAt: new Date().toISOString()
  };

  storage.setProgress(progress);
  renderProgress();
  renderCalendar();
  flash('Progreso guardado. Cadena intacta.');
}

function completedDates() {
  const progress = storage.getProgress();

  return Object.entries(progress)
    .filter(([_, entry]) => entry && (entry.minutes > 0 || entry.warmup || entry.exercise || entry.photo || entry.notes))
    .map(([date]) => date)
    .sort();
}

function getStreak(dates) {
  if (!dates.length) return 0;

  const set = new Set(dates);
  let cursor = parseISO(dates[dates.length - 1]);
  let count = 0;

  while (set.has(iso(cursor))) {
    count++;
    cursor = new Date(cursor.getTime() - DAY);
  }

  return count;
}

function renderProgress() {
  const dates = completedDates();
  const pct = Math.round((dates.length / TOTAL_DAYS) * 100);

  $('#progressRing').style.background = `conic-gradient(var(--accent-3) ${pct * 3.6}deg, rgba(31,138,112,.16) 0deg)`;
  $('#progressRing span').textContent = `${pct}%`;

  if ($('#streakText')) $('#streakText').textContent = `Racha: ${getStreak(dates)} días`;
  if ($('#totalText')) $('#totalText').textContent = `Total: ${dates.length} / ${TOTAL_DAYS}`;
}

function renderCalendar() {
  const done = new Set(completedDates());
  const calendar = $('#calendar');
  if (!calendar) return;

  calendar.innerHTML = '';

  const todayIso = getCourseToday();

  const months = [
  { year: 2026, month: 4, name: 'Mayo 2026' },
  { year: 2026, month: 5, name: 'Junio 2026' },
  { year: 2026, month: 6, name: 'Julio 2026' },
  { year: 2026, month: 7, name: 'Agosto 2026' },
  { year: 2026, month: 8, name: 'Septiembre 2026' }
];

  months.forEach(({ year, month, name }) => {
    const wrap = document.createElement('section');
    wrap.className = 'month';
    wrap.innerHTML = `<h3>${name}</h3><div class="month-grid"></div>`;

    const grid = wrap.querySelector('.month-grid');

    ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'dow';
      el.textContent = d;
      grid.appendChild(el);
    });

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const offset = (first.getDay() + 6) % 7;

    for (let i = 0; i < offset; i++) {
      const b = document.createElement('button');
      b.className = 'day is-empty';
      b.tabIndex = -1;
      grid.appendChild(b);
    }

    for (let day = 1; day <= last.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = iso(date);
      const btn = document.createElement('button');

      btn.className = 'day';
      btn.textContent = String(day);

      const arc = getArcForDate(dateStr);
      const inRange = date >= START && date <= END;

      if (!inRange) btn.disabled = true;
      if (done.has(dateStr)) btn.classList.add('is-done');
      if (dateStr === todayIso) btn.classList.add('is-today');

      if (inRange) {
        const small = document.createElement('small');
        small.textContent = `A${arc.id}`;
        btn.appendChild(small);

        btn.addEventListener('click', () => {
          loadDaily(dateStr);
          setActiveTab('hoy');
          document.getElementById('hoy').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }

      grid.appendChild(btn);
    }

    calendar.appendChild(wrap);
  });

  renderProgress();
}

function makePrompt() {
  const weekName = $('#weekName').value.trim() || 'Semana de entrenamiento';
  const weekGoal = $('#weekGoal').value.trim() || 'Mejorar observación, línea, construcción y claridad visual';

  const prompt = `Actúa como profesor de dibujo especializado en manga shōnen de aventura y composición visual.

Contexto: Kike tiene 19 años, está retomando el dibujo en papel después de años sin practicar. Está haciendo una ruta de verano para terminar con un póster inspirado en escenas corales de manga: muchos detalles, varias acciones simultáneas y cada elemento con una función narrativa.

Semana/arco evaluado: ${weekName}
Objetivo de la semana: ${weekGoal}

Te adjunto 2 o 3 fotos de sus dibujos. No seas destructivo ni genérico. Evalúa pensando en progreso, no en perfección.

Analiza estos apartados con puntuación de 1 a 4:
1. Línea
2. Proporción
3. Volumen / construcción
4. Limpieza
5. Detalle narrativo
6. Composición
7. Expresividad / intención

Devuelve:
- Tabla de puntuaciones 1-4.
- Tres aciertos concretos observables en las imágenes.
- Tres mejoras concretas, ordenadas por prioridad.
- Un ejercicio de 15 minutos para mañana.
- Un ejercicio de 45 minutos para esta semana.
- Una frase de ánimo específica, basada en lo que sí se ve en sus dibujos.

Importante: si hay errores, explica cómo corregirlos de forma práctica. No recomiendes pasar a personajes complejos si antes conviene reforzar objetos, formas y composición.`;

  $('#aiPrompt').value = prompt;
}

function flash(message) {
  const el = document.createElement('div');
  el.textContent = message;
  el.style.cssText = 'position:fixed;left:50%;bottom:1.2rem;transform:translateX(-50%);background:#22180f;color:white;padding:.85rem 1.1rem;border-radius:999px;z-index:999;font-weight:900;box-shadow:0 14px 30px rgba(0,0,0,.25)';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

// Galería local con IndexedDB
let db;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open('kikeMangaQuestGallery', 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore('drawings', { keyPath: 'id' });
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}

async function addDrawing(record) {
  const database = await openDB();

  return new Promise((resolve, reject) => {
    const tx = database.transaction('drawings', 'readwrite');
    tx.objectStore('drawings').put(record);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function getDrawings() {
  const database = await openDB();

  return new Promise((resolve, reject) => {
    const tx = database.transaction('drawings', 'readonly');
    const req = tx.objectStore('drawings').getAll();

    req.onsuccess = () => {
      resolve(req.result.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
    };

    req.onerror = () => reject(req.error);
  });
}

async function deleteDrawing(id) {
  const database = await openDB();

  return new Promise((resolve, reject) => {
    const tx = database.transaction('drawings', 'readwrite');
    tx.objectStore('drawings').delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function loadGallery() {
  const grid = $('#galleryGrid');
  if (!grid) return;

  grid.innerHTML = '<p>Cargando galería...</p>';

  const drawings = await getDrawings();

  if (!drawings.length) {
    grid.innerHTML = '<p class="pill">Todavía no hay dibujos. Sube el primero cuando empiece la misión.</p>';
    return;
  }

  grid.innerHTML = '';

  drawings.forEach(item => {
    const article = document.createElement('article');
    article.className = 'gallery-item';

    article.innerHTML = `
      <img src="${item.dataUrl}" alt="${item.title || 'Dibujo de Kike'}" />
      <h3>${item.title || 'Dibujo sin título'}</h3>
      <p><strong>${item.date || 'Sin fecha'}</strong></p>
      <p>${item.comment || ''}</p>
      <div class="gallery-actions">
        <button class="button button--danger" data-delete="${item.id}">Eliminar</button>
      </div>
    `;

    article.querySelector('[data-delete]').addEventListener('click', async () => {
      await deleteDrawing(item.id);
      loadGallery();
    });

    grid.appendChild(article);
  });
}

async function handleGallerySubmit(event) {
  event.preventDefault();

  const file = $('#galleryFile').files[0];

  if (!file) {
    flash('Selecciona una imagen.');
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    await addDrawing({
      id: crypto.randomUUID(),
      date: $('#galleryDate').value,
      title: $('#galleryTitle').value.trim(),
      comment: $('#galleryComment').value.trim(),
      dataUrl: reader.result,
      createdAt: new Date().toISOString()
    });

    event.target.reset();
    $('#galleryDate').value = getCourseToday();
    loadGallery();
    flash('Dibujo añadido a la galería.');
  };

  reader.readAsDataURL(file);
}

function exportData() {
  const payload = {
    app: 'Summer Manga Quest · Kike',
    exportedAt: new Date().toISOString(),
    progress: storage.getProgress(),
    settings: storage.getSettings(),
    note: 'Las imágenes de la galería se guardan aparte en el navegador mediante IndexedDB; este JSON exporta el progreso textual.'
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `kike-manga-quest-progreso-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);

      if (!payload.progress) throw new Error('Archivo sin progreso');

      storage.setProgress(payload.progress);
      storage.setSettings(payload.settings || {});

      renderProgress();
      renderCalendar();
      flash('Progreso importado.');
    } catch (err) {
      flash('No se pudo importar ese JSON.');
    }
  };

  reader.readAsText(file);
}

function init() {
  renderArcs();

  const today = getCourseToday();

  loadDaily(today);
  $('#galleryDate').value = today;
  renderProgress();

  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });

  $('#startToday').addEventListener('click', () => {
    const today = getCourseToday();
    loadDaily(today);
    setActiveTab('hoy');
    document.getElementById('hoy').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#printPlan').addEventListener('click', () => window.print());

  $('#dailyForm').addEventListener('submit', saveDaily);

  $('#entryDate').addEventListener('change', e => loadDaily(e.target.value));

  $$('.mode').forEach(btn => {
    btn.addEventListener('click', () => {
      $('#minutes').value = btn.dataset.minutes;
      $$('.mode').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  $('#makePrompt').addEventListener('click', makePrompt);

  $('#copyPrompt').addEventListener('click', async () => {
    await navigator.clipboard.writeText($('#aiPrompt').value);
    flash('Prompt copiado.');
  });

  $('#galleryForm').addEventListener('submit', handleGallerySubmit);

  $('#exportData').addEventListener('click', exportData);

  $('#importData').addEventListener('change', e => {
    if (e.target.files[0]) importData(e.target.files[0]);
  });

  $('#resetData').addEventListener('click', () => {
    if (confirm('¿Borrar el progreso local guardado en este navegador?')) {
      localStorage.removeItem('kikeProgress');
      localStorage.removeItem('kikeSettings');
      renderProgress();
      renderCalendar();
      loadDaily(getCourseToday());
      flash('Progreso local borrado.');
    }
  });

  makePrompt();
}

document.addEventListener('DOMContentLoaded', init);
