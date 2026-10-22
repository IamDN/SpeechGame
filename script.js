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
  'A': 'A', 'E': 'E', 'I': 'I', 'O': 'O', 'U': 'U', 'Ů': 'U',
  'B': 'Bé', 'C': 'Cé', 'Č': 'Čé', 'D': 'Dé', 'Ď': 'Ďé',
  'F': 'Ef', 'G': 'Gé', 'H': 'Há', 'CH': 'Chá',
  'J': 'Jé', 'K': 'Ká', 'L': 'El', 'M': 'Em',
  'N': 'En', 'Ň': 'ň', 'P': 'Pé', 'R': 'Er',
  'Ř': 'Ř', 'S': 'Es', 'Š': 'Š', 'T': 'Té',
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
  'Ů': 'Ufoun',
  'V': 'Verunka',
  'W': 'Wendy',
  'X': 'Xenie',
  'Y': 'Yvona',
  'Z': 'Zuzanka',
  'Ž': 'Žofka'
};

/**
 * Seznam kol:
 * 1. Fáze: Kompletní česká abeceda (všech 33 písmen)
 * 2. Fáze: První jednoduchá slova (skládání písmenek do slov: PES, MAMA, TATA, MASO atd.)
 */
const LEVELS = [
  // --- 1. FÁZE: VŠECHNA PÍSMENA ČESKÉ ABECEDY ---
  {
    name: '1. Kolo: Samohlásky',
    type: 'letters',
    animalEmoji: '🐶',
    animalName: 'pejsek',
    letters: ['A', 'E', 'I', 'O', 'U']
  },
  {
    name: '2. Kolo: První souhlásky',
    type: 'letters',
    animalEmoji: '🐱',
    animalName: 'kočička',
    letters: ['M', 'L', 'S', 'P', 'T']
  },
  {
    name: '3. Kolo: Zvířecí abeceda',
    type: 'letters',
    animalEmoji: '🐻',
    animalName: 'medvídek',
    letters: ['B', 'D', 'K', 'R', 'V']
  },
  {
    name: '4. Kolo: Lesní písmenka',
    type: 'letters',
    animalEmoji: '🦊',
    animalName: 'lištička',
    letters: ['J', 'N', 'Z', 'H', 'F']
  },
  {
    name: '5. Kolo: Písmenka u potoka',
    type: 'letters',
    animalEmoji: '🐸',
    animalName: 'žabička',
    letters: ['C', 'G', 'CH', 'Y', 'W']
  },
  {
    name: '6. Kolo: Písmenka s háčky I',
    type: 'letters',
    animalEmoji: '🦁',
    animalName: 'lvíček',
    letters: ['Č', 'Š', 'Ž', 'Ř']
  },
  {
    name: '7. Kolo: Písmenka s háčky II',
    type: 'letters',
    animalEmoji: '🐼',
    animalName: 'panda',
    letters: ['Ď', 'Ť', 'Ň', 'Ů']
  },

  // --- 2. FÁZE: PRVNÍ JEDNODUCHÁ SLOVA ---
  {
    name: '8. Kolo: Slovo PES',
    type: 'word',
    word: 'PES',
    spokenWord: 'pes',
    animalEmoji: '🐶',
    animalName: 'pejsek',
    letters: ['P', 'E', 'S']
  },
  {
    name: '9. Kolo: Slovo MÁMA',
    type: 'word',
    word: 'MAMA',
    displayWord: 'MÁMA',
    spokenWord: 'máma',
    animalEmoji: '🐱',
    animalName: 'kočička',
    letters: ['M', 'A', 'M', 'A']
  },
  {
    name: '10. Kolo: Slovo TÁTA',
    type: 'word',
    word: 'TATA',
    displayWord: 'TÁTA',
    spokenWord: 'táta',
    animalEmoji: '🐻',
    animalName: 'medvídek',
    letters: ['T', 'A', 'T', 'A']
  },
  {
    name: '11. Kolo: Slovo MASO',
    type: 'word',
    word: 'MASO',
    spokenWord: 'maso',
    animalEmoji: '🦁',
    animalName: 'lvíček',
    letters: ['M', 'A', 'S', 'O']
  },
  {
    name: '12. Kolo: Slovo RUKA',
    type: 'word',
    word: 'RUKA',
    spokenWord: 'ruka',
    animalEmoji: '🐼',
    animalName: 'panda',
    letters: ['R', 'U', 'K', 'A']
  },
  {
    name: '13. Kolo: Slovo NOHA',
    type: 'word',
    word: 'NOHA',
    spokenWord: 'noha',
    animalEmoji: '🐸',
    animalName: 'žabička',
    letters: ['N', 'O', 'H', 'A']
  },
  {
    name: '14. Kolo: Slovo LES',
    type: 'word',
    word: 'LES',
    spokenWord: 'les',
    animalEmoji: '🦊',
    animalName: 'lištička',
    letters: ['L', 'E', 'S']
  },
  {
    name: '15. Kolo: Slovo DŮM',
    type: 'word',
    word: 'DUM',
    displayWord: 'DŮM',
    spokenWord: 'dům',
    animalEmoji: '🐭',
    animalName: 'myška',
    letters: ['D', 'U', 'M']
  },
  {
    name: '16. Kolo: Slovo VODA',
    type: 'word',
    word: 'VODA',
    spokenWord: 'voda',
    animalEmoji: '🐘',
    animalName: 'slůně',
    letters: ['V', 'O', 'D', 'A']
  },

  // --- 3. FÁZE: CELÉ JEDNODUCHÉ VĚTY ---
  {
    name: '17. Kolo: Věta – ELLA MELE MASO',
    type: 'sentence',
    words: ['ELLA', 'MELE', 'MASO'],
    spokenSentence: 'Ella mele maso',
    animalEmoji: '🐱',
    animalName: 'kočička'
  },
  {
    name: '18. Kolo: Věta – TÁTA STAVÍ DŮM',
    type: 'sentence',
    words: ['TATA', 'STAVI', 'DUM'],
    displayWords: ['TÁTA', 'STAVÍ', 'DŮM'],
    spokenSentence: 'Táta staví dům',
    animalEmoji: '🐻',
    animalName: 'medvídek'
  },
  {
    name: '19. Kolo: Věta – MÁMA SÁDÍ LES',
    type: 'sentence',
    words: ['MAMA', 'SADI', 'LES'],
    displayWords: ['MÁMA', 'SÁDÍ', 'LES'],
    spokenSentence: 'Máma sází les',
    animalEmoji: '🦊',
    animalName: 'lištička'
  },
  {
    name: '20. Kolo: Věta – PES MÁ RÁD MASO',
    type: 'sentence',
    words: ['PES', 'MA', 'RAD', 'MASO'],
    displayWords: ['PES', 'MÁ', 'RÁD', 'MASO'],
    spokenSentence: 'Pes má rád maso',
    animalEmoji: '🐶',
    animalName: 'pejsek'
  },
  {
    name: '21. Kolo: Věta – KOČKA PIJE MLÉKO',
    type: 'sentence',
    words: ['KOCKA', 'PIJE', 'MLEKO'],
    displayWords: ['KOČKA', 'PIJE', 'MLÉKO'],
    spokenSentence: 'Kočka pije mléko',
    animalEmoji: '🐱',
    animalName: 'kočička'
  }
];

/**
 * Seznam hlavních kapitol pro přeskakování a odemykání
 */
const CHAPTERS = [
  {
    id: 'samohlasky',
    title: '1. Samohlásky',
    emoji: '🅰️',
    description: 'Základní zpěvavá písmenka A, E, I, O, U',
    startLevel: 0,
    requiredLevel: 0 // odemčeno od začátku
  },
  {
    id: 'souhlasky',
    title: '2. Souhlásky',
    emoji: '🐻',
    description: 'Všechna písmena abecedy se zvířátky (Kola 2–7)',
    startLevel: 1,
    requiredLevel: 1 // odemkne se po dokončení samohlásek
  },
  {
    id: 'slova',
    title: '3. První slova',
    emoji: '🐶',
    description: 'Skládání celých slov: PES, MÁMA, TÁTA... (Kola 8–16)',
    startLevel: 7,
    requiredLevel: 7 // odemkne se po projití abecedy
  },
  {
    id: 'vety',
    title: '4. Celé věty',
    emoji: '📖',
    description: 'Skládání a čtení celých vět (Kola 17–21)',
    startLevel: 16,
    requiredLevel: 16 // odemkne se po slovech
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
    this.onStart = null;
    this.onEnd = null;
    this.speechTimeout = null;

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
      return `${sound}, jako ${name}`;
    }
    return sound;
  }

  cancel() {
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }
    if (this.isSupported) {
      try {
        this.synth.cancel();
      } catch (_) {}
    }
  }

  /**
   * Promluví daný text česky.
   * Při mluvení může automaticky zamknout herní vstup a po skončení jej odemknout.
   */
  speak(text, onEndCallback = null, options = {}) {
    // Podpora pro boolean i objekt možností
    const opts = (typeof options === 'boolean') ? { lockDuringSpeech: options } : (options || {});
    const lockDuringSpeech = opts.lockDuringSpeech !== undefined ? opts.lockDuringSpeech : true;
    const unlockOnEnd = opts.unlockOnEnd !== undefined ? opts.unlockOnEnd : true;

    if (!this.isSupported) {
      if (unlockOnEnd && this.onEnd) {
        this.onEnd();
      }
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.cancel();

      // Zamknutí vstupu a zašednutí písmenek během čtení
      if (lockDuringSpeech && this.onStart) {
        this.onStart();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'cs-CZ';
      utterance.rate = 0.85;  // Přirozené, srozumitelné tempo
      utterance.pitch = 1.15; // Přátelský tón pro děti

      if (this.czechVoice) {
        utterance.voice = this.czechVoice;
      }

      let hasEnded = false;
      const finish = () => {
        if (hasEnded) return;
        hasEnded = true;
        if (this.speechTimeout) {
          clearTimeout(this.speechTimeout);
          this.speechTimeout = null;
        }
        // Odemknutí pouze pokud je požadováno (pokud bezprostředně nenásleduje další řeč)
        if (unlockOnEnd && this.onEnd) {
          this.onEnd();
        }
        if (onEndCallback) {
          onEndCallback();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Záchranný pojistný timeout pro případ, že Safari/Chrome neodpálí onend
      const safetyDuration = Math.max(2200, text.length * 150);
      this.speechTimeout = setTimeout(finish, safetyDuration);

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Chyba při syntéze řeči:', err);
      if (unlockOnEnd && this.onEnd) {
        this.onEnd();
      }
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
    this.targetWord = null;
    this.isInputLocked = false;

    // Odkazy na DOM elementy
    this.levelIndicator = document.getElementById('level-indicator');
    this.starsBadge = document.getElementById('stars-badge');
    this.starsListElement = document.getElementById('stars-list');
    this.winStarsCollection = document.getElementById('win-stars-collection');
    this.animalBtn = document.getElementById('animal-btn');
    this.animalAvatar = document.getElementById('animal-avatar');
    this.animalEmoji = document.getElementById('animal-emoji');
    this.bubblePrompt = document.querySelector('.bubble-prompt');
    this.bubbleTarget = document.getElementById('bubble-target');
    this.bubbleName = document.getElementById('bubble-name');
    this.speechBubble = document.getElementById('speech-bubble');
    this.dropZone = document.getElementById('drop-zone');
    this.dropLabel = document.getElementById('drop-label');
    this.wordSlots = document.getElementById('word-slots');
    this.lettersRack = document.getElementById('letters-rack');
    this.startOverlay = document.getElementById('start-overlay');
    this.startBtn = document.getElementById('start-btn');
    this.winOverlay = document.getElementById('win-overlay');
    this.winTitle = document.getElementById('win-title');
    this.winText = document.getElementById('win-text');
    this.nextLevelBtn = document.getElementById('next-level-btn');
    this.soundBtn = document.getElementById('sound-btn');
    this.restartBtn = document.getElementById('restart-btn');

    // Kapitoly a čtení nahlas
    this.chaptersBtn = document.getElementById('chapters-btn');
    this.chaptersOverlay = document.getElementById('chapters-overlay');
    this.closeChaptersBtn = document.getElementById('close-chapters-btn');
    this.chaptersList = document.getElementById('chapters-list');
    this.winChaptersBtn = document.getElementById('win-chapters-btn');
    this.readAloudBanner = document.getElementById('read-aloud-banner');
    this.readAloudText = document.getElementById('read-aloud-text');

    // Hvězdičkový systém
    this.stars = 0;
    try {
      this.stars = parseInt(localStorage.getItem('letterGame_stars') || '0', 10);
      if (isNaN(this.stars)) this.stars = 0;
    } catch (_) {}
    this.updateStarsDisplay(false);

    // Nejvyšší úroveň pro kapitoly
    this.highestLevel = 0;
    try {
      this.highestLevel = parseInt(localStorage.getItem('letterGame_highestLevel') || '0', 10);
      if (isNaN(this.highestLevel)) this.highestLevel = 0;
    } catch (_) {}
    if (this.stars > 0 && this.highestLevel < this.stars) {
      this.highestLevel = Math.min(this.stars, LEVELS.length - 1);
    }

    // Propojení zamykání písmenek během mluvení
    speechManager.onStart = () => this.lockInput();
    speechManager.onEnd = () => this.unlockInput();

    // Stav slovních a větných kol
    this.isWordLevel = false;
    this.isSentenceLevel = false;
    this.currentWordLetters = [];
    this.currentWordIndex = 0;
    this.currentSentenceWords = [];
    this.currentSentenceIndex = 0;

    // Drag & drop stav
    this.activeDrag = null;

    this.bindEvents();
  }

  lockInput() {
    this.isInputLocked = true;
    if (this.lettersRack) {
      this.lettersRack.classList.add('is-locked');
    }
  }

  unlockInput() {
    this.isInputLocked = false;
    if (this.lettersRack) {
      this.lettersRack.classList.remove('is-locked');
    }
  }

  updateStarsDisplay(animate = false) {
    if (!this.starsListElement) return;

    this.starsListElement.innerHTML = '';
    if (this.stars === 0) {
      const emptySpan = document.createElement('span');
      emptySpan.className = 'star-item empty';
      emptySpan.title = 'Zatím žádná hvězdička';
      emptySpan.textContent = '☆';
      this.starsListElement.appendChild(emptySpan);
    } else {
      for (let i = 0; i < this.stars; i++) {
        const span = document.createElement('span');
        span.className = 'star-item';
        if (animate && i === this.stars - 1) {
          span.classList.add('new-star');
        }
        span.textContent = '⭐';
        this.starsListElement.appendChild(span);
      }
    }

    if (animate && this.starsBadge) {
      this.starsBadge.classList.remove('star-pop');
      void this.starsBadge.offsetWidth;
      this.starsBadge.classList.add('star-pop');
    }
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  renderWordSlots(word) {
    if (!this.wordSlots) return;
    this.wordSlots.innerHTML = '';
    for (let i = 0; i < word.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'word-slot' + (i === 0 ? ' active' : '');
      slot.dataset.index = i;
      slot.textContent = '_';
      this.wordSlots.appendChild(slot);
    }
  }

  renderSentenceSlots(level) {
    if (!this.wordSlots) return;
    this.wordSlots.innerHTML = '';
    level.words.forEach((w, idx) => {
      const slot = document.createElement('div');
      slot.className = 'word-slot sentence-slot' + (idx === 0 ? ' active' : '');
      slot.dataset.index = idx;
      slot.textContent = '______';
      this.wordSlots.appendChild(slot);
    });
  }

  openChaptersModal() {
    speechManager.cancel();
    this.unlockInput();
    if (!this.chaptersList || !this.chaptersOverlay) return;

    this.chaptersList.innerHTML = '';
    CHAPTERS.forEach(chap => {
      const isUnlocked = (this.highestLevel >= chap.requiredLevel);
      const isCurrent = (this.currentLevelIndex >= chap.startLevel &&
        (!chap.endLevel || this.currentLevelIndex <= chap.endLevel));

      const item = document.createElement('div');
      item.className = 'chapter-item' + (isUnlocked ? ' unlocked' : ' locked') + (isCurrent ? ' current' : '');

      let statusBadge = isUnlocked ? (isCurrent ? 'Hraješ 🎮' : 'Hrát ▶') : '🔒 Zamčeno';

      item.innerHTML = `
        <div class="chapter-emoji">${chap.emoji}</div>
        <div class="chapter-info">
          <div class="chapter-title">${chap.title}</div>
          <div class="chapter-desc">${chap.description}</div>
        </div>
        <div class="chapter-action-badge">${statusBadge}</div>
      `;

      if (isUnlocked) {
        item.addEventListener('click', () => {
          this.closeChaptersModal();
          this.startLevel(chap.startLevel);
        });
      }

      this.chaptersList.appendChild(item);
    });

    this.chaptersOverlay.classList.remove('hidden');
  }

  closeChaptersModal() {
    if (this.chaptersOverlay) {
      this.chaptersOverlay.classList.add('hidden');
    }
  }

  bindEvents() {
    // Start hry (odemkne audio na mobilu)
    this.startBtn.addEventListener('click', () => {
      speechManager.unlock();
      this.startOverlay.classList.add('hidden');
      this.startLevel(0);
    });

    // Tlačítka pro otevření / zavření kapitol
    if (this.chaptersBtn) {
      this.chaptersBtn.addEventListener('click', () => this.openChaptersModal());
    }
    if (this.closeChaptersBtn) {
      this.closeChaptersBtn.addEventListener('click', () => this.closeChaptersModal());
    }
    if (this.winChaptersBtn) {
      this.winChaptersBtn.addEventListener('click', () => {
        this.winOverlay.classList.add('hidden');
        this.openChaptersModal();
      });
    }

    // Kliknutí na zvířátko nebo bublinu -> zopakuje přání
    const repeatPrompt = () => {
      if ((!this.targetLetter && !this.targetWord) || this.isInputLocked) return;
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
    this.lockInput();
    this.currentLevelIndex = index;
    const level = LEVELS[this.currentLevelIndex];
    this.levelIndicator.textContent = level.name;

    // Podpora pro obrázek (např. 'frog.jpg') i emoji placeholder
    if (level.image) {
      this.animalAvatar.innerHTML = `<img src="${level.image}" alt="${level.animalName || 'zvířátko'}" class="animal-img">`;
    } else {
      this.animalAvatar.innerHTML = `<span class="animal-emoji" id="animal-emoji">${level.animalEmoji || '🐶'}</span>`;
    }

    if (level.type === 'sentence') {
      this.isWordLevel = false;
      this.isSentenceLevel = true;
      this.currentSentenceWords = [...level.words];
      this.currentSentenceIndex = 0;

      if (this.wordSlots) {
        this.wordSlots.classList.remove('hidden');
        this.renderSentenceSlots(level);
      }
      if (this.dropLabel) {
        this.dropLabel.textContent = `Slož celou větu:`;
      }

      // Zamíchat slova pro nabídku v regálu
      const shuffledWords = this.shuffleArray(level.words);
      this.renderRack(shuffledWords, level);
      this.pickNextTarget();
    } else if (level.type === 'word') {
      this.isWordLevel = true;
      this.isSentenceLevel = false;
      this.currentWord = level.word;
      this.currentWordLetters = level.word.split('');
      this.currentWordIndex = 0;

      if (this.wordSlots) {
        this.wordSlots.classList.remove('hidden');
        this.renderWordSlots(level.word);
      }
      if (this.dropLabel) {
        this.dropLabel.textContent = `Slož slovo ${level.displayWord || level.word}:`;
      }

      // Zamíchat písmenka v regálu, aby dítě muselo hledat správné pořadí
      const shuffledLetters = this.shuffleArray(level.letters);
      this.renderRack(shuffledLetters, level);
      this.pickNextTarget();
    } else {
      this.isWordLevel = false;
      this.isSentenceLevel = false;
      if (this.wordSlots) {
        this.wordSlots.classList.add('hidden');
      }
      if (this.dropLabel) {
        this.dropLabel.textContent = 'Sem přetáhni písmenko';
      }

      this.remainingLetters = [...level.letters];
      this.renderRack(level.letters, level);
      this.pickNextTarget();
    }
  }

  renderRack(items, level = null) {
    this.lettersRack.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      const isWord = (item.length > 1);
      card.className = 'letter-card' + (isWord ? ' word-card' : '');

      let displayText = item;
      if (this.isSentenceLevel && level && level.displayWords) {
        const idx = level.words.indexOf(item);
        if (idx !== -1 && level.displayWords[idx]) {
          displayText = level.displayWords[idx];
        }
      }

      card.textContent = displayText;
      card.dataset.letter = item;
      card.setAttribute('role', 'button');

      if (!isWord) {
        const name = speechManager.getLetterName(item);
        card.setAttribute('aria-label', name ? `Písmeno ${item} jako ${name}` : `Písmeno ${item}`);
        if (name) {
          card.setAttribute('title', `${item} jako ${name}`);
        }
      } else {
        card.setAttribute('aria-label', `Slovo ${displayText}`);
        card.setAttribute('title', `Slovo ${displayText}`);
      }

      // Pointer event pro zahájení tažení
      card.addEventListener('pointerdown', (e) => this.handlePointerDown(e, card));

      this.lettersRack.appendChild(card);
    });
  }

  pickNextTarget() {
    const level = LEVELS[this.currentLevelIndex];

    if (this.isSentenceLevel) {
      if (this.currentSentenceIndex >= this.currentSentenceWords.length) {
        this.handleLevelComplete();
        return;
      }

      this.targetLetter = this.currentSentenceWords[this.currentSentenceIndex];
      this.targetWord = this.targetLetter;

      let targetDisplay = this.targetLetter;
      if (level.displayWords && level.displayWords[this.currentSentenceIndex]) {
        targetDisplay = level.displayWords[this.currentSentenceIndex];
      }

      if (this.bubblePrompt) {
        this.bubblePrompt.textContent = 'Slož větu:';
      }
      this.bubbleTarget.textContent = targetDisplay;
      this.bubbleName.textContent = '';

      // Aktualizace stavu slotů věty
      if (this.wordSlots) {
        const slots = this.wordSlots.querySelectorAll('.word-slot');
        slots.forEach((s, idx) => {
          if (idx < this.currentSentenceIndex) {
            let placedWord = level.words[idx];
            if (level.displayWords && level.displayWords[idx]) {
              placedWord = level.displayWords[idx];
            }
            s.className = 'word-slot sentence-slot filled';
            s.textContent = placedWord;
          } else if (idx === this.currentSentenceIndex) {
            s.className = 'word-slot sentence-slot active';
            s.textContent = '______';
          } else {
            s.className = 'word-slot sentence-slot';
            s.textContent = '______';
          }
        });
      }

      setTimeout(() => {
        this.promptTarget();
      }, 350);
    } else if (this.isWordLevel) {
      if (this.currentWordIndex >= this.currentWordLetters.length) {
        this.handleLevelComplete();
        return;
      }

      this.targetLetter = this.currentWordLetters[this.currentWordIndex];
      this.targetWord = null;

      if (this.bubblePrompt) {
        this.bubblePrompt.textContent = `Slovo ${level.displayWord || level.word}:`;
      }
      this.bubbleTarget.textContent = this.targetLetter;
      const name = speechManager.getLetterName(this.targetLetter);
      this.bubbleName.textContent = name ? `jako ${name}` : '';

      // Aktualizace stavu slotů slova
      if (this.wordSlots) {
        const slots = this.wordSlots.querySelectorAll('.word-slot');
        slots.forEach((s, idx) => {
          if (idx < this.currentWordIndex) {
            s.className = 'word-slot filled';
          } else if (idx === this.currentWordIndex) {
            s.className = 'word-slot active';
          } else {
            s.className = 'word-slot';
          }
        });
      }

      setTimeout(() => {
        this.promptTarget();
      }, 350);
    } else {
      this.targetWord = null;
      if (this.bubblePrompt) {
        this.bubblePrompt.textContent = 'Já chci...';
      }
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

      setTimeout(() => {
        this.promptTarget();
      }, 350);
    }
  }

  promptTarget() {
    this.lockInput();
    if (!this.targetLetter && !this.targetWord) return;
    const level = LEVELS[this.currentLevelIndex];

    // Hravá animace bubliny
    this.bubbleTarget.style.transform = 'scale(1.2)';
    setTimeout(() => {
      this.bubbleTarget.style.transform = '';
    }, 250);

    if (this.isSentenceLevel) {
      let targetDisplay = this.targetLetter;
      if (level.displayWords && level.displayWords[this.currentSentenceIndex]) {
        targetDisplay = level.displayWords[this.currentSentenceIndex];
      }
      if (this.currentSentenceIndex === 0) {
        speechManager.speak(`Složíme větu! Já chci slovo... ${targetDisplay}!`, null, { unlockOnEnd: true });
      } else if (this.currentSentenceIndex === this.currentSentenceWords.length - 1) {
        speechManager.speak(`A nakonec slovo... ${targetDisplay}!`, null, { unlockOnEnd: true });
      } else {
        speechManager.speak(`A teď slovo... ${targetDisplay}!`, null, { unlockOnEnd: true });
      }
    } else if (this.isWordLevel) {
      const desc = speechManager.getLetterDescription(this.targetLetter);
      if (this.currentWordIndex === 0) {
        speechManager.speak(`Slovo ${level.spokenWord || level.word}! Já chci... ${desc}`, null, { unlockOnEnd: true });
      } else {
        speechManager.speak(`A teď... ${desc}`, null, { unlockOnEnd: true });
      }
    } else {
      const desc = speechManager.getLetterDescription(this.targetLetter);
      speechManager.speak(`Já chci... ${desc}`, null, { unlockOnEnd: true });
    }
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
    const isWord = (card.dataset.letter.length > 1);
    clone.className = 'letter-clone' + (isWord ? ' word-clone' : '');
    clone.textContent = card.textContent;
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
    this.lockInput();
    const { clone, card, letter } = drag;
    const isCorrect = (letter === this.targetLetter);
    const level = LEVELS[this.currentLevelIndex];

    if (isCorrect) {
      clone.remove();
      card.classList.remove('is-dragging');
      card.classList.add('solved');

      this.dropZone.classList.add('success');
      this.animalAvatar.classList.add('chewing');

      if (this.isSentenceLevel) {
        let displayWord = letter;
        if (level.displayWords && level.displayWords[this.currentSentenceIndex]) {
          displayWord = level.displayWords[this.currentSentenceIndex];
        }

        if (this.wordSlots) {
          const activeSlot = this.wordSlots.querySelector(`.word-slot[data-index="${this.currentSentenceIndex}"]`);
          if (activeSlot) {
            activeSlot.textContent = displayWord;
            activeSlot.className = 'word-slot sentence-slot filled';
          }
        }
        this.currentSentenceIndex++;

        // Je celá věta hotová?
        if (this.currentSentenceIndex >= this.currentSentenceWords.length) {
          const sentenceSpoken = level.spokenSentence;
          speechManager.speak(`Mňam mňam mňam! Výborně, celá věta je hotová! A teď to zkus přečíst nahlas ty: ${sentenceSpoken}!`, () => {
            this.dropZone.classList.remove('success');
            this.animalAvatar.classList.remove('chewing');
            this.handleLevelComplete();
          }, { unlockOnEnd: false });
          return;
        }

        // Další slovo ve větě (neodemykat vstup, ihned navazuje další zadání)
        speechManager.speak(`Mňam mňam mňam, slovo ${displayWord}!`, () => {
          this.dropZone.classList.remove('success');
          this.animalAvatar.classList.remove('chewing');
          this.pickNextTarget();
        }, { unlockOnEnd: false });
      } else if (this.isWordLevel) {
        const letterDesc = speechManager.getLetterDescription(letter);

        if (this.wordSlots) {
          const activeSlot = this.wordSlots.querySelector(`.word-slot[data-index="${this.currentWordIndex}"]`);
          if (activeSlot) {
            activeSlot.textContent = letter;
            activeSlot.className = 'word-slot filled';
          }
        }
        this.currentWordIndex++;

        // Je celé slovo hotové?
        if (this.currentWordIndex >= this.currentWordLetters.length) {
          const wordSpoken = level.spokenWord || level.word;
          speechManager.speak(`Mňam mňam mňam, mám rád ${letterDesc}! Výborně, slovo ${wordSpoken} je hotové! A teď to zkus přečíst nahlas ty: ${wordSpoken}!`, () => {
            this.dropZone.classList.remove('success');
            this.animalAvatar.classList.remove('chewing');
            this.handleLevelComplete();
          }, { unlockOnEnd: false });
          return;
        }

        // Další písmeno ve slově (neodemykat vstup, ihned navazuje další zadání)
        speechManager.speak(`Mňam mňam mňam, mám rád ${letterDesc}`, () => {
          this.dropZone.classList.remove('success');
          this.animalAvatar.classList.remove('chewing');
          this.pickNextTarget();
        }, { unlockOnEnd: false });
      } else {
        const letterDesc = speechManager.getLetterDescription(letter);
        this.remainingLetters = this.remainingLetters.filter(l => l !== letter);

        // Další písmeno v kole (neodemykat vstup, ihned navazuje další zadání)
        speechManager.speak(`Mňam mňam mňam, mám rád ${letterDesc}`, () => {
          this.dropZone.classList.remove('success');
          this.animalAvatar.classList.remove('chewing');
          this.pickNextTarget();
        }, { unlockOnEnd: false });
      }
    } else {
      this.dropZone.classList.add('wrong');
      this.animalAvatar.classList.add('disgusted');

      let rejectText = '';
      if (this.isSentenceLevel) {
        const idx = level.words.indexOf(letter);
        const disp = (idx !== -1 && level.displayWords && level.displayWords[idx]) ? level.displayWords[idx] : letter;
        rejectText = `Fuj, to je slovo ${disp}`;
      } else {
        rejectText = `Fuj, to je ${speechManager.getLetterDescription(letter)}`;
      }

      speechManager.speak(rejectText, () => {
        this.dropZone.classList.remove('wrong');
        this.animalAvatar.classList.remove('disgusted');
      }, { unlockOnEnd: true });

      this.cancelDrop(drag);
    }
  }

  handleLevelComplete() {
    this.bubbleTarget.textContent = '⭐';
    this.bubbleName.textContent = '';
    if (this.bubblePrompt) {
      this.bubblePrompt.textContent = 'Výborně!';
    }
    this.animalAvatar.classList.add('happy');

    // Zvýšení počtu hvězdiček
    this.stars++;
    try {
      localStorage.setItem('letterGame_stars', this.stars.toString());
    } catch (_) {}
    this.updateStarsDisplay(true);

    // Odemčení další úrovně a kapitol
    this.highestLevel = Math.max(this.highestLevel, this.currentLevelIndex + 1);
    try {
      localStorage.setItem('letterGame_highestLevel', this.highestLevel.toString());
    } catch (_) {}

    // Zobrazení hvězdiček i ve vítězném okně
    if (this.winStarsCollection) {
      this.winStarsCollection.innerHTML = '';
      for (let i = 0; i < this.stars; i++) {
        const span = document.createElement('span');
        span.className = 'star-item';
        if (i === this.stars - 1) {
          span.classList.add('new-star');
        }
        span.textContent = '⭐';
        this.winStarsCollection.appendChild(span);
      }
    }

    const level = LEVELS[this.currentLevelIndex];

    // Výzva k hlasitému přečtení u slov a vět
    if (this.readAloudBanner && this.readAloudText) {
      if (level.type === 'sentence') {
        const sentenceText = level.displayWords ? level.displayWords.join(' ') : level.words.join(' ');
        this.readAloudText.textContent = sentenceText;
        this.readAloudBanner.classList.remove('hidden');
      } else if (level.type === 'word') {
        this.readAloudText.textContent = level.displayWord || level.word;
        this.readAloudBanner.classList.remove('hidden');
      } else {
        this.readAloudBanner.classList.add('hidden');
      }
    }

    // Ohlášení úspěchu a získání hvězdičky
    setTimeout(() => {
      speechManager.speak('Super, získal jsi hvězdičku! Jdeme do dalšího kola!', null, { unlockOnEnd: false });
    }, 300);

    launchConfetti();

    setTimeout(() => {
      this.animalAvatar.classList.remove('happy');
      const nextLevel = LEVELS[(this.currentLevelIndex + 1) % LEVELS.length];

      this.winTitle.textContent = `Skvěle, ${level.name} je hotovo!`;
      this.winText.textContent = `Zvířátko je najezené a spokojené. Chceš zkusit ${nextLevel.name}?`;
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

