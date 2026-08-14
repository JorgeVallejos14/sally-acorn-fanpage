/* ============================================
   SALLY ACORN FAN PAGE — script.js
   JS vanilla: dark mode, lightbox, quiz, filtro, comparador
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    /* ==== 1. DARK / LIGHT MODE (persistido en localStorage) ===== */
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const THEME_KEY = 'sally-theme';

    function aplicarTema(tema) {
        if (tema === 'light') {
            root.setAttribute('data-theme', 'light');
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            root.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-pressed', 'false');
        }
      }

  // Cargar preferencia guardada (o del sistema si no hay ninguna)
  const temaGuardado = localStorage.getItem(THEME_KEY);
  if (temaGuardado) {
    aplicarTema(temaGuardado);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    aplicarTema('light');
  }

    themeToggle.addEventListener('click', () => {
    const esClaroActualmente = root.getAttribute('data-theme') === 'light';
    const nuevoTema = esClaroActualmente ? 'dark' : 'light';
    aplicarTema(nuevoTema);
    localStorage.setItem(THEME_KEY, nuevoTema);
  });

    /* ===== 2. LIGHTBOX (event delegation) ===== */
  const galeria = document.querySelector('.galeria-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function abrirLightbox(imgEl) {
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = 'hidden'; // evita scroll de fondo
  }

  function cerrarLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Delegación: un solo listener en el contenedor, no uno por thumbnail
  galeria.addEventListener('click', (e) => {
    const thumb = e.target.closest('.thumb');
    if (!thumb) return;
    const img = thumb.querySelector('img');
    abrirLightbox(img);
  });

    // Accesibilidad: abrir con Enter/Espacio si el thumb tiene foco (tabindex="0")
  galeria.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const thumb = e.target.closest('.thumb');
    if (!thumb) return;
    e.preventDefault();
    abrirLightbox(thumb.querySelector('img'));
  });

  lightboxClose.addEventListener('click', cerrarLightbox);

  // Cerrar al hacer click afuera de la imagen
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrarLightbox();
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) cerrarLightbox();
  });

    /* ===== 3. COMPARADOR DE VERSIONES (slider con clip-path) ===== */
  const comparadorSlider = document.getElementById('comparador-slider');
  const comparadorWrapper = document.querySelector('.comparador-wrapper');

  if (comparadorSlider && comparadorWrapper) {
    const imgModerna = comparadorWrapper.querySelectorAll('img')[1];

    comparadorSlider.addEventListener('input', (e) => {
      const valor = e.target.value; // 0 a 100
      imgModerna.style.clipPath = `inset(0 ${100 - valor}% 0 0)`;
    });
  }

    /* ===== 4. FILTRO DE APARICIONES ===== */
  const filtroInput = document.getElementById('filtro-apariciones');
  const listaApariciones = document.querySelectorAll('#lista-apariciones li');

  filtroInput.addEventListener('input', () => {
    const termino = filtroInput.value.trim().toLowerCase();

    listaApariciones.forEach((item) => {
      const texto = item.textContent.toLowerCase();
      const coincide = texto.includes(termino);
      item.hidden = !coincide;
    });
  });


    /* ===== 4.5 TRIVIA / DATOS CURIOSOS ===== */
  const datosCuriosos = [
    'Sally Acorn debutó en 1993 en la serie animada "Sonic the Hedgehog" (conocida como SatAM).',
    'Su dispositivo de inteligencia artificial, NICOLE, empezó como una simple computadora de mano.',
    'Sally es hija del Rey Max Acorn, gobernante de Knothole antes de ser derrocado por el Dr. Robotnik.',
    'En los cómics de Archie, Sally lideró a los Freedom Fighters desde muy joven.',
    'A diferencia de Sonic, Sally se caracteriza por su enfoque estratégico y pensamiento táctico en batalla.',
    'Sally ha tenido varios rediseños de vestuario a lo largo de las distintas eras de los cómics.',
    'Su nombre completo en algunos materiales es Sally Alicia Acorn.'
  ];
 
  const triviaBtn = document.getElementById('trivia-btn');
  const triviaTexto = document.getElementById('trivia-texto');
  const triviaContador = document.getElementById('trivia-contador');
  const triviaCard = document.querySelector('.trivia-card');
  let ultimoIndice = -1;
  let vistos = 0;
 
  triviaBtn.addEventListener('click', () => {
    let indice;
    do {
      indice = Math.floor(Math.random() * datosCuriosos.length);
    } while (indice === ultimoIndice && datosCuriosos.length > 1);
 
    ultimoIndice = indice;
    vistos = Math.min(vistos + 1, datosCuriosos.length);
 
    triviaTexto.textContent = datosCuriosos[indice];
    triviaContador.textContent = `Dato ${indice + 1} de ${datosCuriosos.length}`;
 
    // Reinicia la animación quitando y agregando la clase
    triviaCard.classList.remove('pulso');
    void triviaCard.offsetWidth; // fuerza reflow para que la animación se repita
    triviaCard.classList.add('pulso');
  });

    /* ===== 5. QUIZ CON PUNTAJE ===== */
  const quizForm = document.getElementById('quiz-form');
  const quizResultado = document.getElementById('quiz-resultado');

  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(quizForm);
    const respuestas = [...formData.values()];

    if (respuestas.length < quizForm.querySelectorAll('fieldset').length) {
      quizResultado.textContent = 'Oye, responde todas las preguntas antes de enviar 🙃';
      return;
    }

    const correctas = respuestas.filter((r) => r === 'correcta').length;
    const total = quizForm.querySelectorAll('fieldset').length;

    let mensaje = `Obtuviste ${correctas} de ${total} correctas. `;
    if (correctas === total) {
      mensaje += '¡Eres un verdadero Freedom Fighter! 🦔💙';
    } else if (correctas > 0) {
      mensaje += 'Nada mal, pero te falta ver más SatAM 📺';
    } else {
      mensaje += 'Ouch... a estudiar la wiki de Sonic 😅';
    }

    quizResultado.textContent = mensaje;
  });

    /* ===== 6. BONUS: SCROLL ANIMATIONS con Intersection Observer ===== */
  const secciones = document.querySelectorAll('main > section');

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observer.unobserve(entrada.target); // solo anima una vez
      }
    });
  }, { threshold: 0.15 });

  secciones.forEach((seccion) => {
    seccion.classList.add('pre-animacion');
    observer.observe(seccion);
  });

});