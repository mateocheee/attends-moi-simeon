/* ------- Désactive le scroll sur certaines vidéos ------- */
// Désactive la restauration automatique du scroll
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Forcer la page à s'ouvrir tout en haut, sans smooth scroll
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});



/* ------- Détection de page ------- */
const path = window.location.pathname;
const isHome  = path.endsWith('/') || path.includes('index.html');
const isVideo = !isHome && path.includes('video');

/* ✅ Clé par onglet (se réinitialise quand l’onglet est fermé) */
const INTRO_KEY = 'intro_done_once_session';

/* ------- Helpers visuels ------- */
function setLogosVisibility(showSmall) {
  const initialGif = document.getElementById('logo-gif-initial');
  const scrollGif  = document.getElementById('logo-gif-scroll');
  if (!initialGif || !scrollGif) return;
  if (showSmall) {
    initialGif.style.display = 'none';
    scrollGif.style.display = 'block';
  } else {
    initialGif.style.display = 'block';
    scrollGif.style.display = 'none';
  }
}

/* --- VIDÉOS : toujours petit header, jamais de “redescente” --- */
window.addEventListener('DOMContentLoaded', () => {
  if (isVideo) {
    document.body.classList.add('scrolled');
    document.body.classList.remove('intro-active');
    setLogosVisibility(true);
  }
});

/* --- HOME : intro une fois par onglet (rejouée seulement si l’onglet est fermé/réouvert) --- */
window.addEventListener('DOMContentLoaded', () => {
  if (!isHome) return;

  // Empêche la restauration auto du scroll par le navigateur
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  const introDone = sessionStorage.getItem(INTRO_KEY) === '1';

  if (introDone) {
    // ✅ Même onglet après être déjà entré : pas d’intro
    document.body.classList.add('scrolled');
    document.body.classList.remove('intro-active');
    setLogosVisibility(true);
    return;
  }

  // ✅ Première fois dans CET onglet : état initial = plein écran + en haut
  document.body.classList.remove('scrolled');
  document.body.classList.add('intro-active');
  setLogosVisibility(false);
  window.scrollTo(0, 0);

  // Attendre scroll/clic pour terminer l’intro
  const finishIntro = () => {
    document.body.classList.add('scrolled');
    document.body.classList.remove('intro-active');
    sessionStorage.setItem(INTRO_KEY, '1');  // persiste tant que l’onglet reste ouvert
    setLogosVisibility(true);
    window.removeEventListener('scroll', onIntroScroll);
    window.removeEventListener('click', onIntroClick);
  };

  const onIntroScroll = () => { if (window.scrollY > 10) finishIntro(); };
  const onIntroClick  = () => finishIntro();

  window.addEventListener('scroll', onIntroScroll);
  window.addEventListener('click', onIntroClick);
});

/* --- Scroll global : ne JAMAIS retirer .scrolled hors intro home --- */
window.addEventListener('scroll', () => {
  if (isVideo) return; // vidéos verrouillées
  if (isHome && sessionStorage.getItem(INTRO_KEY) === '1') {
    document.body.classList.add('scrolled');
    setLogosVisibility(true);
  }
});

/* --- About me : auto-scroll vers la section correcte (id = about-me) --- */
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('about_me.html')) {
    const aboutSection = document.getElementById('about-me');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'auto' });
    }
  }
});

/* --- Effet "weird-justify" --- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".weird-justify p").forEach(p => {
    const words = p.innerHTML.split(" ");
    p.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(" ");
  });

  function randomizeSpacing() {
    document.querySelectorAll(".weird-justify p").forEach(p => {
      const spans = p.querySelectorAll("span.word");
      spans.forEach((span, i) => {
        // Ignore les premiers et derniers mots pour garder la 1re/dernière ligne normales
        if (i > 3 && i < spans.length - 3) {
          const random = Math.random() * 1.5; // espace aléatoire (0 à 1.5em)
          span.style.marginRight = `${random}em`;
        } else {
          span.style.marginRight = "0";
        }
      });
    });
  }

  randomizeSpacing();
  // Optionnel : varier les espacements toutes les 5 secondes
  // setInterval(randomizeSpacing, 5000);
});


// --- Scroll auto après la fin du GIF d'intro ---
window.addEventListener('load', () => {
  const gif = document.getElementById('logo-gif-initial');

  if (!gif) return;

  // ⏱ Durée du GIF en millisecondes
  const gifDuration = 6200; // 7s

  setTimeout(() => {
      // Active l'état "scrolled" (réduit la bannière)
      document.body.classList.add('scrolled');

      // Scroll vers les projets
      const projects = document.getElementById('projects');
      if (projects) {
          projects.scrollIntoView({ behavior: 'smooth' });
      }
  }, gifDuration);
});
