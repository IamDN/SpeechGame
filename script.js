/**
 * Krmení zvířátka – Dětská hra pro výuku písmenek
 * Čistý JavaScript, HTML5 & Pointer Events API + SpeechSynthesis API (cs-CZ)
 */

// ============================================================================
// 1. Konfigurace herních kol a výslovnosti písmen
// ============================================================================

/**
 * Fonetická mapa pro přirozenou českou výslovnost písmen
 */
const PRONUNCIATION_MAP = {
  'A': 'A', 'E': 'E', 'I': 'I', 'O': 'O', 'U': 'U',
  'B': 'Bé', 'C': 'Cé', 'Č': 'Čé', 'D': 'Dé', 'Ď': 'Ďé',
  'F': 'Ef', 'G': 'Gé', 'H': 'Há', 'CH': 'Chá',
  'J': 'Jé', 'K': 'Ká', 'L': 'El', 'M': 'Em',
  'N': 'En', 'Ň': 'Eň', 'P': 'Pé', 'R': 'Er',
  'Ř': 'Eř', 'S': 'Es', 'Š': 'Eš', 'T': 'Té',
  'Ť': 'Ťé', 'V': 'Vé', 'W': 'Dvojité vé', 'X': 'Iks',
  'Y': 'Ypsilon', 'Z': 'Zet', 'Ž': 'Žet'
};

/**
 * Přátelská jména pro každé písmeno abecedy (např. D jako David, E jako Ella, V jako Verunka)
 */
const LETTER_NAMES = {
  'A': 'Adélka',
  'B': 'Barborka',
  'C': 'Cilka',
  'Č': 'Čenda',
  'D': 'David',
  'Ď': 'Ďurko',
  'E': 'Ella',
  'F': 'Filípek',
  'G': 'Gábinka',
  'H': 'Honzík',
  'CH': 'Chlupáč',
  'I': 'Ivanka',
  'J': 'Jeníček',
  'K': 'Kubík',
  'L': 'Lucinka',
  'M': 'Matýsek',
  'N': 'Nela',
  'Ň': 'Ňufík',
  'O': 'Ondra',
  'P': 'Petřík',
  'R': 'Rozárka',
  'Ř': 'Řehoř',
  'S': 'Sofinka',
  'Š': 'Šimonek',
  'T': 'Tomášek',
  'Ť': 'Ťapka',
  'U': 'Uršulka',
  'V': 'Verunka',
  'W': 'Wendy',
  'X': 'Xenie',
  'Y': 'Yvona',
  'Z': 'Zuzanka',
  'Ž': 'Žofka'
};

/**
 * Seznam kol. Každé kolo má název, zvířátko a seznam písmenek.
 * Lze velmi snadno rozšiřovat o další kola a nová písmena.
 */
const LEVELS = [
  {
    name: '1. Kolo: Samohlásky',
    animalEmoji: '🐶',
    animalName: 'pejsek',
    letters: ['A', 'E', 'I', 'O', 'U']
  },
  {
    name: '2. Kolo: První souhlásky',
    animalEmoji: '🐱',
    animalName: 'kočička',
    letters: ['M', 'L', 'S', 'P', 'T']
  },
  {
    name: '3. Kolo: Zvířecí abeceda',
    animalEmoji: '🐻',
    animalName: 'medvídek',
    letters: ['B', 'D', 'K', 'R', 'V']
  },
  {
    name: '4. Kolo: Písmenka s háčky',
    animalEmoji: '🦁',
    animalName: 'lvíček',
    letters: ['Č', 'Š', 'Ž', 'Ř', 'Ď']
  }
];

// ============================================================================
// 2. Modul syntézy řeči (Speech Synthesis - cs-CZ)
// ============================================================================

class SpeechManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.czechVoice = null;
    this.isSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    this.isUnlocked = false;

    if (this.isSupported) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.isSupported) return;
    const voices = this.synth.getVoices();
    // Vyhledání českého hlasu (cs-CZ, cs_CZ, cs)
    this.czechVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('cs')) || null;
  }

  /**
   * Odemkne audio pro mobilní Safari / Chrome po prvním dotyku/kliku
   */
  unlock() {
    if (!this.isSupported || this.isUnlocked) return;
    this.isUnlocked = true;
    try {
      const silent = new SpeechSynthesisUtterance('');
      silent.volume = 0;
      this.synth.speak(silent);
    } catch (e) {
      console.warn('Speech unlock attempt failed:', e);
    }
  }

  getLetterSound(letter) {
    return PRONUNCIATION_MAP[letter.toUpperCase()] || letter;
  }

  getLetterName(letter) {
    return LETTER_NAMES[letter.toUpperCase()] || '';
  }

  getLetterDescription(letter) {
    const sound = this.getLetterSound(letter);
    const name = this.getLetterName(letter);
    if (name) {
      return `${sound} jako ${name}`;
    }
    return sound;
  }

  /**
   * Promluví daný text česky
   */
  speak(text, onEndCallback = null) {
    if (!this.isSupported) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.synth.cancel(); // Zruší jakoukoli běžící řeč, aby se nevrstvila
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'cs-CZ';
      utterance.rate = 0.9;  // Mírně pomalejší tempo pro děti
      utterance.pitch = 1.15; // Mírně vyšší, přátelský tón pro děti

      if (this.czechVoice) {
        utterance.voice = this.czechVoice;
      }

      if (onEndCallback) {
        utterance.onend = () => onEndCallback();
        utterance.onerror = () => onEndCallback();
      }

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Chyba při syntéze řeči:', err);
      if (onEndCallback) onEndCallback();
    }
  }
}

// Inicializace správce řeči
const speechManager = new SpeechManager();

// ============================================================================
// 3. Herní logika a stav hry
// ============================================================================

class LetterGame {
  constructor() {
    this.currentLevelIndex = 0;
    this.remainingLetters = [];
    this.targetLetter = null;
    this.isInputLocked = false;

    // Odkazy na DOM elementy
    this.levelIndicator = document.getElementById('level-indicator');
    this.animalBtn = document.getElementById('animal-btn');
    this.animalAvatar = document.getElementById('animal-avatar');
    this.animalEmoji = document.getElementById('animal-emoji');
    this.bubbleTarget = document.getElementById('bubble-target');
    this.bubbleName = document.getElementById('bubble-name');
    this.speechBubble = document.getElementById('speech-bubble');
    this.dropZone = document.getElementById('drop-zone');
    this.lettersRack = document.getElementById('letters-rack');
    this.startOverlay = document.getElementById('start-overlay');
    this.startBtn = document.getElementById('start-btn');
    this.winOverlay = document.getElementById('win-overlay');
    this.winTitle = document.getElementById('win-title');
    this.winText = document.getElementById('win-text');
    this.nextLevelBtn = document.getElementById('next-level-btn');
    this.soundBtn = document.getElementById('sound-btn');
    this.restartBtn = document.getElementById('restart-btn');

    // Drag & drop stav
    this.activeDrag = null;

    this.bindEvents();
  }

  bindEvents() {
    // Start hry (odemkne audio na mobilu)
    this.startBtn.addEventListener('click', () => {
      speechManager.unlock();
      this.startOverlay.classList.add('hidden');
      this.startLevel(0);
    });

    // Kliknutí na zvířátko nebo bublinu -> zopakuje přání
    const repeatPrompt = () => {
      if (!this.targetLetter || this.isInputLocked) return;
      this.promptTarget();
    };
    this.animalBtn.addEventListener('click', repeatPrompt);
    this.speechBubble.addEventListener('click', repeatPrompt);
    this.soundBtn.addEventListener('click', repeatPrompt);

    // Restart aktuální hry
    this.restartBtn.addEventListener('click', () => {
      this.startLevel(0);
    });

    // Další kolo
    this.nextLevelBtn.addEventListener('click', () => {
      this.winOverlay.classList.add('hidden');
      const nextIdx = (this.currentLevelIndex + 1) % LEVELS.length;
      this.startLevel(nextIdx);
    });

    // Globální pointer eventy pro drag & drop
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerCancel(e));
  }

  startLevel(index) {
    this.currentLevelIndex = index;
    const level = LEVELS[this.currentLevelIndex];
    this.levelIndicator.textContent = level.name;

    // Podpora pro obrázek (např. 'frog.jpg') i emoji placeholder
    if (level.image) {
      this.animalAvatar.innerHTML = `<img src="${level.image}" alt="${level.animalName || 'zvířátko'}" class="animal-img">`;
    } else {
      this.animalAvatar.innerHTML = `<span class="animal-emoji" id="animal-emoji">${level.animalEmoji || '🐶'}</span>`;
    }

    // Kopie písmen pro aktuální kolo
    this.remainingLetters = [...level.letters];
    this.renderRack(level.letters);
    this.pickNextTarget();
  }

  renderRack(letters) {
    this.lettersRack.innerHTML = '';
    letters.forEach(char => {
      const card = document.createElement('div');
      card.className = 'letter-card';
      card.textContent = char;
      card.dataset.letter = char;
      card.setAttribute('role', 'button');
      
      const name = speechManager.getLetterName(char);
      card.setAttribute('aria-label', name ? `Písmeno ${char} jako ${name}` : `Písmeno ${char}`);
      if (name) {
        card.setAttribute('title', `${char} jako ${name}`);
      }

      // Pointer event pro zahájení tažení
      card.addEventListener('pointerdown', (e) => this.handlePointerDown(e, card));

      this.lettersRack.appendChild(card);
    });
  }

  pickNextTarget() {
    if (this.remainingLetters.length === 0) {
      this.handleLevelComplete();
      return;
    }

    // Náhodný výběr jednoho ze zbývajících písmen
    const randomIndex = Math.floor(Math.random() * this.remainingLetters.length);
    this.targetLetter = this.remainingLetters[randomIndex];
    this.bubbleTarget.textContent = this.targetLetter;
    const name = speechManager.getLetterName(this.targetLetter);
    this.bubbleName.textContent = name ? `jako ${name}` : '';

    // Zvíře promluví a řekne, co chce
    setTimeout(() => {
      this.promptTarget();
    }, 350);
  }

  promptTarget() {
    if (!this.targetLetter) return;
    const desc = speechManager.getLetterDescription(this.targetLetter);
    // Hravá animace bubliny
    this.bubbleTarget.style.transform = 'scale(1.2)';
    setTimeout(() => {
      this.bubbleTarget.style.transform = '';
    }, 250);

    speechManager.speak(`Já chci... ${desc}`);
  }


  // ==========================================================================
  // Pointer Drag & Drop Engine (Funguje na dotyku i myši)
  // ==========================================================================

  handlePointerDown(e, card) {
    if (this.isInputLocked || card.classList.contains('solved')) return;
    if (e.button !== undefined && e.button !== 0) return;

    const rect = card.getBoundingClientRect();

    // Vytvoření plovoucího klonu pro plynulé tažení
    const clone = document.createElement('div');
    clone.className = 'letter-clone';
    clone.textContent = card.dataset.letter;
    clone.style.left = `${e.clientX}px`;
    clone.style.top = `${e.clientY}px`;
    document.body.appendChild(clone);

    card.classList.add('is-dragging');

    this.activeDrag = {
      card,
      clone,
      letter: card.dataset.letter,
      originRect: rect,
      pointerId: e.pointerId
    };

    try {
      card.setPointerCapture(e.pointerId);
    } catch (_) {}
  }

  handlePointerMove(e) {
    if (!this.activeDrag) return;

    const { clone } = this.activeDrag;
    clone.style.left = `${e.clientX}px`;
    clone.style.top = `${e.clientY}px`;

    const dropRect = this.dropZone.getBoundingClientRect();
    const isOver = (
      e.clientX >= dropRect.left &&
      e.clientX <= dropRect.right &&
      e.clientY >= dropRect.top &&
      e.clientY <= dropRect.bottom
    );

    if (isOver) {
      this.dropZone.classList.add('drag-over');
    } else {
      this.dropZone.classList.remove('drag-over');
    }
  }

  handlePointerUp(e) {
    if (!this.activeDrag) return;

    const drag = this.activeDrag;
    this.activeDrag = null;
    this.dropZone.classList.remove('drag-over');

    try {
      drag.card.releasePointerCapture(drag.pointerId);
    } catch (_) {}

    const dropRect = this.dropZone.getBoundingClientRect();
    const isDroppedInZone = (
      e.clientX >= dropRect.left &&
      e.clientX <= dropRect.right &&
      e.clientY >= dropRect.top &&
      e.clientY <= dropRect.bottom
    );

    if (isDroppedInZone) {
      this.evaluateDrop(drag);
    } else {
      this.cancelDrop(drag);
    }
  }

  handlePointerCancel(e) {
    if (!this.activeDrag) return;
    const drag = this.activeDrag;
    this.activeDrag = null;
    this.dropZone.classList.remove('drag-over');
    this.cancelDrop(drag);
  }

  cancelDrop(drag) {
    const { clone, card, originRect } = drag;
    const destX = originRect.left + originRect.width / 2;
    const destY = originRect.top + originRect.height / 2;

    clone.style.transition = 'all 0.22s ease-out';
    clone.style.left = `${destX}px`;
    clone.style.top = `${destY}px`;
    clone.style.transform = 'translate(-50%, -50%) scale(0.95)';

    setTimeout(() => {
      clone.remove();
      card.classList.remove('is-dragging');
    }, 220);
  }

  evaluateDrop(drag) {
    const { clone, card, letter } = drag;
    const isCorrect = (letter === this.targetLetter);
    const letterDesc = speechManager.getLetterDescription(letter);

    if (isCorrect) {
      clone.remove();
      card.classList.remove('is-dragging');
      card.classList.add('solved');

      this.dropZone.classList.add('success');
      this.animalAvatar.classList.add('chewing');

      this.remainingLetters = this.remainingLetters.filter(l => l !== letter);

      // Zvíře: "Mňam mňam mňam, mám rád [písmenko jako jméno]"
      speechManager.speak(`Mňam mňam mňam, mám rád ${letterDesc}`, () => {
        this.dropZone.classList.remove('success');
        this.animalAvatar.classList.remove('chewing');
        this.pickNextTarget();
      });
    } else {
      this.dropZone.classList.add('wrong');
      this.animalAvatar.classList.add('disgusted');

      // Zvíře: "Fuj, to je [písmenko jako jméno]"
      speechManager.speak(`Fuj, to je ${letterDesc}`, () => {
        this.dropZone.classList.remove('wrong');
        this.animalAvatar.classList.remove('disgusted');
      });

      this.cancelDrop(drag);
    }
  }

  handleLevelComplete() {
    this.bubbleTarget.textContent = '⭐';
    this.bubbleName.textContent = '';
    this.animalAvatar.classList.add('happy');

    // Ohlášení úspěchu a přechodu do dalšího kola
    setTimeout(() => {
      speechManager.speak('Super, jdeme do dalšího kola!');
    }, 300);

    launchConfetti();

    setTimeout(() => {
      this.animalAvatar.classList.remove('happy');
      const level = LEVELS[this.currentLevelIndex];
      const nextLevel = LEVELS[(this.currentLevelIndex + 1) % LEVELS.length];

      this.winTitle.textContent = `Skvěle, ${level.name} je hotovo!`;
      this.winText.textContent = `Zvířátko je spokojené a najezené. Chceš zkusit ${nextLevel.name}?`;
      this.winOverlay.classList.remove('hidden');
    }, 1400);
  }
}

// ============================================================================
// 4. Efekt konfet pro oslavu
// ============================================================================

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c', '#da77f2', '#ffa94d'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 1
    });
  }

  let animationId;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.vRot;
      p.life -= 0.012;

      if (p.life > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (alive) {
      animationId = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationId);
    }
  }

  update();
}

// ============================================================================
// 5. Spuštění hry po načtení stránky
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  window.letterGame = new LetterGame();
});

