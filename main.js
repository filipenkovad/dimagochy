const TOTAL_TURNS = 12;
const EVENT_DELAY_MS = 5000;
const TURN_DELAY_MS = 7600;
let audioContext = null;
let soundEnabled = true;

const memeImages = {
  start: "assets/memes/start.svg",
  toilet: "assets/memes/toilet.svg",
  pynya: "assets/memes/pynya.svg",
  mashaOut: "assets/memes/masha-out.svg",
  ps: "assets/memes/ps.svg",
  code: "assets/memes/code.svg",
  squash: "assets/memes/squash.svg",
  sausage: "assets/memes/sausage.svg",
  brunch: "assets/memes/brunch.svg",
  frog: "assets/memes/frog.svg",
  tuktuk: "assets/memes/tuktuk.svg",
  spice: "assets/memes/spice.svg",
  cow: "assets/memes/cow.svg",
  skater: "assets/memes/skater.svg",
  dance: "assets/memes/dance.svg",
  tinder: "assets/memes/tinder.svg",
  notGay: "assets/photos/not-gay.jpeg",
};

const statsConfig = [
  { id: "home", label: "Домашний заряд", color: "#6aa5d8" },
  { id: "masha", label: "Машин интерес", color: "#e889a5" },
  { id: "pynya", label: "Пыня-синхрон", color: "#72b26b" },
  { id: "toilet", label: "Туалетная стабильность", color: "#48a7a0" },
  { id: "vibe", label: "Репинский вайб", color: "#f2c94c" },
];

const busyPhrases = {
  default: [
    "Дима занят. Решения временно принимаются без демократии.",
    "Дима делает вид, что всё под контролем.",
    "Дима проживает последствия вашего выбора.",
    "Дима обрабатывает мемную нагрузку.",
  ],
  toilet: [
    "Дима в туалете. Следующий ход подождёт.",
    "Дима ушёл на пять минут по репинскому времени.",
    "Дима стабилизирует внутреннюю систему.",
  ],
  pynya: [
    "Дима гладит Пыню. Мир поставлен на паузу.",
    "Пыня заняла Диму полностью.",
    "Дима и Пыня синхронизируются без свидетелей.",
  ],
  masha: [
    "Маша ведёт, Дима идёт. Всё честно.",
    "Дима уточняет, долго ли ещё гулять.",
    "Маша уже выбрала маршрут, Дима ещё выбирает лицо.",
  ],
  ps: [
    "Дима в катке. Доступ к действиям временно закрыт.",
    "Диван держит Диму крепко.",
    "Дима нажимает кнопки с серьёзным лицом.",
  ],
  code: [
    "Дима кодит. Не трогать, идёт магия.",
    "Дима смотрит в баг, баг смотрит в Диму.",
    "Репинский вайб компилируется.",
  ],
  squash: [
    "Дима и Маша машут ракетками. Мячик в стрессе.",
    "Дима потеет стратегически.",
    "Сквош идёт, домашний заряд терпит.",
  ],
  sausage: [
    "Дима ест сосиску в тесте. Это важный процесс.",
    "Дима восстанавливает ресурс через тесто.",
    "Сосиска в тесте делает свою работу.",
  ],
  brunch: [
    "Дима вошёл в тестостероновый режим.",
    "Идут мужские вопросики. Подождите.",
    "Бранч требует концентрации и мяса.",
  ],
};

const locations = {
  apartment: {
    name: "Квартира Репиных",
    tag: "диван, PS и подозрительно уютно",
    className: "location-apartment",
  },
  bathroom: {
    name: "Туалетный храм",
    tag: "время здесь течёт иначе",
    className: "location-bathroom",
  },
  spb: {
    name: "Питер",
    tag: "Маша точно знает, куда идти",
    className: "location-spb",
  },
  sri: {
    name: "Шри-Ланка",
    tag: "hello sir, you need tuk-tuk?",
    className: "location-sri",
  },
  spice: {
    name: "Spice garden",
    tag: "туда никто не просил, но уже везут",
    className: "location-spice",
  },
  cow: {
    name: "Лес с коровой",
    tag: "огромная скульптура без объяснений",
    className: "location-cow",
  },
  brunch: {
    name: "Тестостероновый бранч",
    tag: "мясо, пиво и мужские вопросики",
    className: "location-brunch",
  },
  squash: {
    name: "Сквош-корт",
    tag: "Попотеем вместе?",
    className: "location-squash",
  },
};

const characters = [
  {
    id: "dima",
    name: "Дима",
    kind: "person dima outfit-home",
    x: "38%",
    y: "84px",
    mood: "idle",
  },
  {
    id: "masha",
    name: "Маша",
    kind: "person masha",
    x: "58%",
    y: "84px",
    mood: "idle",
  },
  {
    id: "pynya",
    name: "Пыня",
    kind: "cat pynya",
    x: "25%",
    y: "88px",
    mood: "happy",
  },
];

const actions = [
  {
    id: "toilet",
    title: "Посидеть в туалете",
    icon: "WC",
    hint: "стабильность растёт, мир подождёт",
    location: "bathroom",
    animation: "toilet",
    outfit: "outfit-home",
    mood: "happy",
    image: memeImages.toilet,
    imagePosition: "center",
    effects: { home: 8, masha: -6, pynya: -2, toilet: 20, vibe: 2 },
    lines: [
      "Дима уходит на пять минут. Проходит эпоха.",
      "Туалетная стабильность восстановлена, гости слегка волнуются.",
      "Дима нашёл место, где никто не спрашивает про spice garden.",
    ],
  },
  {
    id: "pynya",
    title: "Погладить Пыню",
    icon: "П",
    hint: "и пусть весь мир подождет",
    location: "apartment",
    animation: "pynya",
    outfit: "outfit-home",
    mood: "happy",
    image: memeImages.pynya,
    imagePosition: "center",
    effects: { home: 10, masha: 3, pynya: 18, toilet: -3, vibe: 5 },
    lines: [
      "Пыня садится рядом. Дима достигает домашнего дзена.",
      "Пыня одобряет ход партии. Это редкая честь.",
      "Дима и Пыня синхронизировались на частоте дивана.",
    ],
  },
  {
    id: "masha",
    title: "Сходить с Машей",
    icon: "М",
    hint: "Дима сопротивляется, любовь побеждает",
    location: "spb",
    animation: "masha",
    outfit: "outfit-tourist",
    mashaOutfit: "outfit-cap",
    mood: "stressed",
    image: memeImages.mashaOut,
    imagePosition: "center",
    effects: { home: -7, masha: 18, pynya: -4, toilet: -5, vibe: 8 },
    lines: [
      "Маша уже в куртке. Дима ещё морально дома, но ноги пошли.",
      "Дима уточняет, далеко ли идти. Маша отвечает маршрутом на три точки.",
      "Домашний заряд грустит, зато Машин интерес идёт уверенным шагом.",
    ],
  },
  {
    id: "ps",
    title: "Поиграть в PS",
    icon: "PS",
    hint: "диван, экран, Пыня на коленях",
    location: "apartment",
    animation: "ps",
    outfit: "outfit-home",
    mood: "focused",
    image: memeImages.ps,
    imagePosition: "center",
    effects: { home: 12, masha: -5, pynya: 6, toilet: -4, vibe: 3 },
    lines: [
      "Дима включает PS. Пыня уже заняла стратегическую позицию.",
      "Геймпад в руках. Внешний мир временно отключён.",
      "Пыня наблюдает за каткой с лицом продюсера.",
    ],
  },
  {
    id: "code",
    title: "Кодить",
    icon: "JS",
    hint: "Репинский вайб через логические страдания",
    location: "apartment",
    animation: "laptop",
    outfit: "outfit-skuf",
    mood: "focused",
    image: memeImages.code,
    imagePosition: "center",
    effects: { home: 4, masha: -2, pynya: -2, toilet: -6, vibe: 9 },
    lines: [
      "Дима кодит. На лице спокойствие человека, который видел прод.",
      "Ноутбук шумит, Репинский вайб компилируется.",
      "Дима исправляет баг так тихо, что багу становится стыдно.",
    ],
  },
  {
    id: "squash",
    title: "Сходить на сквош",
    icon: "SQ",
    hint: "ракетки, корт и спортивный вайб",
    location: "squash",
    animation: "squash",
    outfit: "outfit-testosterone",
    mashaOutfit: "outfit-sport",
    mood: "happy",
    image: memeImages.squash,
    imagePosition: "center",
    effects: { home: -7, masha: 8, pynya: -4, toilet: -4, vibe: 10 },
    lines: [
      "Дима и Маша берут ракетки. Мячик сразу понимает, что вечер будет нервный.",
      "На корте жарко, быстро и слегка непонятно, кто кого тренирует.",
      "Дима отбивает мяч, Маша отбивает желание сразу пойти домой.",
    ],
  },
  {
    id: "sausage",
    title: "Съесть сосиску в тесте",
    icon: "ST",
    hint: "простая радость сложного человека",
    location: "spb",
    animation: "masha",
    outfit: "outfit-home",
    mashaOutfit: "outfit-glasses",
    mood: "happy",
    image: memeImages.sausage,
    imagePosition: "center",
    effects: { home: 7, masha: 2, pynya: -1, toilet: 7, vibe: 8 },
    lines: [
      "Сосиска в тесте заходит как маленький праздник.",
      "Дима ест сосиску в тесте. Баланс мира временно восстановлен.",
      "Это не гастрономия, это эмоциональная поддержка.",
    ],
  },
  {
    id: "brunch",
    title: "Тестостероновый бранч",
    icon: "TB",
    hint: "мясо, пиво, мужские вопросики",
    location: "brunch",
    animation: "brunch",
    outfit: "outfit-testosterone",
    companionAs: "kamil",
    mood: "happy",
    image: memeImages.brunch,
    imagePosition: "center",
    effects: { home: -4, masha: -8, pynya: -2, toilet: -2, vibe: 14 },
    lines: [
      "Арт-бранч отменяется. Сегодня мясо, пиво и мужские вопросики.",
      "Дима и Камиль обсуждают важное. Очень важное. Никто не записал.",
      "Тестостероновый бранч поднял вайб, но Маша всё видит.",
    ],
  },
];

const events = [
  {
    id: "frog",
    title: "ЛЯМГУШКА",
    text: "Кто-то говорит слово без смысла. Все почему-то смеются. Вайб резко растёт.",
    location: null,
    className: "frog-in",
    keepClassUntilNextAction: true,
    image: memeImages.frog,
    imagePosition: "center",
    effects: { vibe: 10, masha: 2, pynya: 2 },
  },
  {
    id: "tuktuk",
    title: "Hello sir, you need tuk-tuk?",
    text: "Тук-тук подъезжает к краю экрана и предлагает ехать вообще куда угодно.",
    location: null,
    className: "tuktuk-in",
    keepClassUntilNextAction: true,
    image: memeImages.tuktuk,
    imagePosition: "center",
    effects: { home: -3, toilet: -3, vibe: 5 },
  },
  {
    id: "spice",
    title: "Spice garden trap",
    text: "Вы уже в spice garden. Никто не помнит, как согласились.",
    location: "spice",
    className: "tuktuk-in",
    image: memeImages.spice,
    imagePosition: "center",
    effects: { home: -5, masha: 3, toilet: -5, vibe: 7 },
  },
  {
    id: "cow",
    title: "Огромная корова в лесу",
    text: "Посреди леса стоит корова. Объяснений нет. Игра считает это локацией.",
    location: "cow",
    className: "",
    image: memeImages.cow,
    imagePosition: "center",
    effects: { vibe: 9, home: 2 },
  },
  {
    id: "nogei",
    title: "С Саньком (не геи)",
    text: "С Саньком (не геи). Просто два уверенных мужчины на фоне красивого вида, вопросов нет.",
    location: "brunch",
    className: "",
    companionAs: "kamil",
    dimaEffect: "not-gay-pose",
    companionEffect: "not-gay-pose",
    image: memeImages.notGay,
    imagePosition: "50% 42%",
    effects: { vibe: 12, masha: -2 },
  },
  {
    id: "skater",
    title: "Старый скейтер проснулся",
    text: "На секунду появляется Дима с пирсингом и ощущением 2007 года.",
    location: null,
    className: "",
    outfit: "outfit-skater",
    dimaEffect: "skate-run",
    image: memeImages.skater,
    imagePosition: "center",
    effects: { vibe: 8, home: -3 },
  },
  {
    id: "dance",
    title: "Народные танцы",
    text: "Дима неожиданно выдаёт движение. Все понимают: биография сложнее, чем казалось.",
    location: null,
    className: "",
    outfit: "outfit-folk",
    dimaEffect: "dance-mode",
    image: memeImages.dance,
    imagePosition: "center",
    effects: { vibe: 9, masha: 3 },
  },
  {
    id: "tinder",
    title: "Тиндер мэтч",
    text: "Машин интерес растёт снова.",
    location: "spb",
    className: "tinder-in",
    keepClassUntilNextAction: true,
    forceMasha: true,
    image: memeImages.tinder,
    imagePosition: "center",
    effects: { masha: 8, vibe: 6, home: 1 },
  },
];

const endings = [
  {
    id: "toilet",
    title: "Туалетный отшельник",
    condition: (s) => s.toilet >= 86,
    text: "Дима достиг такой стабильности, что игра предложила поставить табличку «не беспокоить до следующего дня рождения».",
  },
  {
    id: "pynya",
    title: "Пыня takeover",
    condition: (s) => s.pynya >= 84,
    text: "Пыня полностью захватила сцену, диван и эмоциональную экономику партии. Дима не против.",
  },
  {
    id: "masha",
    title: "Маша всё-таки вытащила",
    condition: (s) => s.masha >= 82 && s.home <= 45,
    text: "Дима хотел спокойно дома, но Маша собрала маршрут, людей и причину выйти. В итоге всем понравилось, особенно Маше.",
  },
  {
    id: "spice",
    title: "Spice garden hostage",
    condition: (s, game) => game.location === "spice" || game.seenEvents.has("spice"),
    text: "Тук-тук довёз компанию в spice garden. Формально партия закончилась, но гид уже достал корицу.",
  },
  {
    id: "brunch",
    title: "Тестостероновый патриарх",
    condition: (s, game) => game.actionCounts.brunch >= 2,
    text: "Мясо, пиво и мужские вопросики сделали своё дело. Арт-бранчи уважаем, но тут был отдельный культурный институт.",
  },
  {
    id: "home",
    title: "Домашний режим победил",
    condition: (s) => s.home >= 82 && s.masha < 50,
    text: "Диван, PS и Пыня доказали, что наружный мир переоценён. Маша уже планирует реванш.",
  },
  {
    id: "perfect",
    title: "Легендарный Репинский вайб",
    condition: (s, game) =>
      s.vibe >= 92 &&
      s.masha >= 55 &&
      s.pynya >= 55 &&
      s.toilet >= 45 &&
      s.home >= 45 &&
      game.seenEvents.size >= 4,
    text: "Дима и дома посидел, и с Машей выбрался, и Пыню погладил, и мемы выдержал. Компания признаёт: день рождения сбалансирован идеально.",
  },
  {
    id: "frog",
    title: "ЛЯМГУШКА ending",
    condition: (s, game) => game.seenEvents.has("frog") && s.vibe >= 70,
    text: "Смысла никто не понял, но все смеются. Возможно, это и есть взрослая дружба.",
  },
  {
    id: "normal",
    title: "Нормальный репинский день",
    condition: () => true,
    text: "Ничего не сломалось, Дима спокоен, гости довольны. Где-то на фоне всё ещё спрашивают про tuk-tuk.",
  },
];

const state = {
  turn: 1,
  location: "apartment",
  stats: {},
  availableActions: [],
  actionCounts: {},
  seenEvents: new Set(),
  activeStageClasses: new Set(),
  log: [],
  locked: false,
  currentAction: null,
  busyText: "",
};

const els = {
  stage: document.querySelector("#stage"),
  characters: document.querySelector("#characters"),
  stats: document.querySelector("#stats"),
  actions: document.querySelector("#actions"),
  turnLabel: document.querySelector("#turnLabel"),
  locationName: document.querySelector("#locationName"),
  locationTag: document.querySelector("#locationTag"),
  eventBubble: document.querySelector("#eventBubble"),
  memeCard: document.querySelector("#memeCard"),
  memePhoto: document.querySelector("#memePhoto"),
  memeTitle: document.querySelector("#memeTitle"),
  memeText: document.querySelector("#memeText"),
  logList: document.querySelector("#logList"),
  ending: document.querySelector("#ending"),
  endingTitle: document.querySelector("#endingTitle"),
  endingText: document.querySelector("#endingText"),
  tutorialCard: document.querySelector("#tutorialCard"),
  tutorialClose: document.querySelector("#tutorialClose"),
  soundButton: document.querySelector("#soundButton"),
  restartButton: document.querySelector("#restartButton"),
  playAgainButton: document.querySelector("#playAgainButton"),
};

function init() {
  els.restartButton.addEventListener("click", resetGame);
  els.playAgainButton.addEventListener("click", resetGame);
  els.tutorialClose.addEventListener("click", () => {
    els.tutorialCard.classList.add("hidden");
  });
  els.soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    els.soundButton.textContent = soundEnabled ? "Звук вкл" : "Звук выкл";
    els.soundButton.setAttribute("aria-pressed", String(soundEnabled));
    if (soundEnabled) {
      playSound("toggle");
    }
  });
  renderCharacters();
  resetGame();
}

function resetGame() {
  clearStageEffects();
  state.turn = 1;
  state.location = "apartment";
  state.stats = {
    home: 56,
    masha: 52,
    pynya: 58,
    toilet: 48,
    vibe: 50,
  };
  state.actionCounts = {};
  state.seenEvents = new Set();
  state.activeStageClasses = new Set();
  state.log = [];
  state.locked = false;
  state.currentAction = null;
  state.busyText = "";
  els.ending.classList.add("hidden");
  setBubble("Выберите первое действие для Димы.");
  setMeme({
    title: "Репин просыпается",
    text: "Дима пока подозрительно спокоен. Это ненадолго.",
    image: memeImages.start,
  });
  chooseActions();
  renderAll();
}

function renderCharacters() {
  els.characters.innerHTML = characters
    .map(
      (character) => `
        <div class="character ${character.kind}" id="char-${character.id}" data-name="${character.name}" data-mood="${character.mood}" style="--x:${character.x}; --y:${character.y};">
          <div class="sprite-shadow"></div>
          <div class="tail"></div>
          <div class="ears"></div>
          <div class="legs"></div>
          <div class="arm-left"></div>
          <div class="arm-right"></div>
          <div class="body"></div>
          <div class="head"></div>
          <div class="hair"></div>
          <div class="face"></div>
        </div>
      `
    )
    .join("");
}

function renderAll() {
  renderStats();
  renderActions();
  renderLocation();
  renderLog();
  els.turnLabel.textContent = `Ход ${Math.min(state.turn, TOTAL_TURNS)} / ${TOTAL_TURNS}`;
}

function renderStats() {
  els.stats.innerHTML = statsConfig
    .map((stat) => {
      const value = clamp(state.stats[stat.id]);
      return `
        <div class="stat">
          <div class="stat-head">
            <span>${stat.label}</span>
            <span>${value}</span>
          </div>
          <div class="stat-bar" aria-label="${stat.label}: ${value}">
            <div class="stat-fill" style="--value:${value}%; --fill:${stat.color};"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderActions() {
  els.actions.classList.toggle("is-hidden", state.locked);
  if (state.locked) {
    els.actions.innerHTML = `
      <div class="busy-card" aria-live="polite">
        <span class="busy-dot"></span>
        <span>${state.busyText || sample(busyPhrases.default)}</span>
      </div>
    `;
    return;
  }

  els.actions.innerHTML = state.availableActions
    .map(
      (action) => `
        <button class="action-button" type="button" data-action="${action.id}" ${state.locked ? "disabled" : ""}>
          <span class="action-icon">${action.icon}</span>
          <span>
            <span class="action-title">${action.title}</span>
            <span class="action-hint">${action.hint}</span>
          </span>
        </button>
      `
    )
    .join("");

  els.actions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => playAction(button.dataset.action));
  });
}

function renderLocation() {
  const location = locations[state.location];
  els.locationName.textContent = location.name;
  els.locationTag.textContent = location.tag;
  els.stage.className = `stage ${location.className}`;
  applyActiveStageClasses();
}

function renderLog() {
  els.logList.innerHTML = state.log
    .slice(0, 8)
    .map((entry) => `<li>${entry}</li>`)
    .join("");
}

function playAction(actionId) {
  if (state.locked) return;
  const action = actions.find((item) => item.id === actionId);
  if (!action) return;

  playSound("action");
  clearStageEffects();
  state.locked = true;
  state.currentAction = action;
  state.busyText = getBusyText(action);
  renderActions();

  state.actionCounts[action.id] = (state.actionCounts[action.id] || 0) + 1;
  state.location = action.location;
  applyEffects(action.effects);
  animateAction(action);

  const actionLine = sample(action.lines);
  pushLog(actionLine);
  setBubble(actionLine);
  setMeme({ ...action, text: actionLine });
  renderAll();
  applyActionStageMode(action);

  window.setTimeout(() => {
    const event = chooseEvent(action);
    if (event) {
      playEvent(event);
    }
  }, EVENT_DELAY_MS);

  window.setTimeout(() => {
    state.turn += 1;
    if (state.turn > TOTAL_TURNS) {
      finishGame();
      return;
    }
    chooseActions();
    state.locked = false;
    state.busyText = "";
    renderAll();
    if (state.currentAction) {
      applyActionStageMode(state.currentAction);
    }
  }, TURN_DELAY_MS);
}

function playEvent(event) {
  playSound(event.id);
  state.seenEvents.add(event.id);
  if (event.location) {
    state.location = event.location;
  }
  if (event.outfit) {
    setDimaOutfit(event.outfit);
  }
  applyEffects(event.effects);
  pushLog(event.title);
  setBubble(event.title);
  setMeme(event);
  renderStats();
  renderLocation();
  if (event.className) {
    els.stage.classList.add(event.className);
    if (event.keepClassUntilNextAction) {
      state.activeStageClasses.add(event.className);
    }
  }
  if (state.currentAction) {
    applyActionStageMode(state.currentAction);
  }
  applyCharacterEffects(event);
  renderLog();
}

function chooseActions() {
  const weighted = actions
    .map((action) => {
      const count = state.actionCounts[action.id] || 0;
      const currentLocationBonus = action.location === state.location ? 2 : 0;
      return { action, weight: Math.max(1, 5 - count * 1.3 + currentLocationBonus) };
    })
    .sort(() => Math.random() - 0.5);

  const result = [];
  while (result.length < 3 && weighted.length) {
    const picked = weightedPick(weighted);
    result.push(picked.action);
    const index = weighted.indexOf(picked);
    weighted.splice(index, 1);
  }
  state.availableActions = result;
}

function chooseEvent(action) {
  if (action.id === "brunch") {
    return events.find((event) => event.id === "nogei");
  }

  const baseChance = 1;
  if (Math.random() > baseChance) return null;

  const candidates = events.filter((event) => {
    const seenPenalty = state.seenEvents.has(event.id);
    if (seenPenalty && Math.random() < 0.86) return false;
    if (event.id === "spice" && action.id !== "masha" && state.location !== "sri") return false;
    if (event.id === "nogei") return false;
    return true;
  });

  const pool = candidates.length ? candidates : events;
  const weighted = pool.map((event) => ({
    event,
    weight: getEventWeight(event, action),
  }));
  return weightedPick(weighted).event;
}

function getEventWeight(event, action) {
  if (event.id === "nogei" && action.id === "brunch") return 7;
  if (event.id === "frog") return 3.4;
  return 1;
}

function animateAction(action) {
  const dima = document.querySelector("#char-dima");
  const masha = document.querySelector("#char-masha");
  const pynya = document.querySelector("#char-pynya");
  [dima, masha, pynya].forEach((node) => {
    node.className = node.className
      .replace(/\saction-[a-z]+/g, "")
      .replace(/\soutfit-[a-z]+/g, "");
    node.dataset.mood = "idle";
  });

  setDimaOutfit(action.outfit);
  dima.classList.add(`action-${action.animation}`);
  dima.dataset.mood = action.mood;

  if (action.companionAs === "kamil") {
    setCompanion("kamil");
    masha.classList.add("action-brunch");
    masha.dataset.mood = "happy";
  }

  if (action.id === "masha" || action.id === "sausage") {
    masha.classList.add("action-masha");
    if (action.id === "masha") {
      dima.classList.add("pair-walk");
      masha.classList.add("pair-walk");
    }
    if (action.mashaOutfit) {
      masha.classList.add(action.mashaOutfit);
    }
    masha.dataset.mood = "happy";
  }
  if (action.id === "squash") {
    masha.classList.add("action-squash");
    dima.classList.add("action-squash");
    if (action.mashaOutfit) {
      masha.classList.add(action.mashaOutfit);
    }
    masha.dataset.mood = "happy";
  }
  if (action.id === "pynya" || action.id === "ps" || action.id === "code") {
    pynya.classList.add(`action-${action.id === "code" ? "laptop" : action.id}`);
    pynya.classList.add("pynya-chaos");
    pynya.dataset.mood = "happy";
  }
  if (action.id === "toilet") {
    masha.dataset.mood = "stressed";
  }
}

function clearStageEffects() {
  [
    "tuktuk-in",
    "frog-in",
    "tinder-in",
    "only-dima",
    "hide-masha",
    "masha-far",
  ].forEach((className) => els.stage.classList.remove(className));
  state.activeStageClasses.clear();
  const dima = document.querySelector("#char-dima");
  const masha = document.querySelector("#char-masha");
  const pynya = document.querySelector("#char-pynya");
  [dima, masha, pynya].forEach((node) => {
    node.className = node.className.replace(/\saction-[a-z]+/g, "");
  });
  dima.classList.remove("skate-run", "dance-mode", "pair-walk", "not-gay-pose");
  masha.dataset.mood = "idle";
  masha.classList.remove(
    "outfit-cap",
    "outfit-glasses",
    "outfit-sport",
    "as-kamil",
    "pair-walk",
    "not-gay-pose"
  );
  masha.dataset.name = "Маша";
  pynya.classList.remove("pynya-chaos");
  pynya.dataset.mood = "happy";
  dima.dataset.mood = "idle";
  state.currentAction = null;
}

function applyActiveStageClasses() {
  state.activeStageClasses.forEach((className) => els.stage.classList.add(className));
}

function applyActionStageMode(action) {
  if (action.id === "toilet") {
    els.stage.classList.add("only-dima");
  }
  if (action.id === "pynya" || action.id === "ps") {
    els.stage.classList.add("hide-masha");
  }
  if (action.id === "code") {
    els.stage.classList.add("masha-far");
  }
}

function applyCharacterEffects(item) {
  const dima = document.querySelector("#char-dima");
  const masha = document.querySelector("#char-masha");
  if (item.companionAs === "kamil") {
    setCompanion("kamil");
  }
  if (item.companionEffect) {
    masha.classList.add(item.companionEffect);
    masha.dataset.mood = "happy";
  }
  if (item.forceMasha) {
    els.stage.classList.remove("hide-masha", "masha-far", "only-dima");
    masha.classList.add("action-tinder");
    masha.dataset.mood = "happy";
  }
  if (item.dimaEffect) {
    dima.classList.add(item.dimaEffect);
    dima.dataset.mood = "happy";
  }
}

function setCompanion(type) {
  const masha = document.querySelector("#char-masha");
  if (type === "kamil") {
    masha.classList.remove("outfit-cap", "outfit-glasses");
    masha.classList.add("as-kamil");
    masha.dataset.name = "Камиль";
  }
}

function setDimaOutfit(outfit) {
  const dima = document.querySelector("#char-dima");
  dima.classList.remove(
    "outfit-home",
    "outfit-skater",
    "outfit-testosterone",
    "outfit-tourist",
    "outfit-skuf",
    "outfit-folk"
  );
  dima.classList.add(outfit || "outfit-home");
}

function finishGame() {
  playSound("ending");
  state.locked = true;
  const ending = endings.find((item) => item.condition(state.stats, state));
  els.endingTitle.textContent = ending.title;
  els.endingText.textContent = ending.text;
  els.ending.classList.remove("hidden");
}

function setBubble(text) {
  els.eventBubble.textContent = text;
  els.eventBubble.classList.remove("pop");
  void els.eventBubble.offsetWidth;
  els.eventBubble.classList.add("pop");
}

function setMeme(item) {
  els.memeTitle.textContent = item.title;
  els.memeText.textContent = item.text;
  if (item.image) {
    els.memePhoto.classList.add("has-image");
    els.memePhoto.style.backgroundImage = `url("${item.image}")`;
    els.memePhoto.style.backgroundPosition = item.imagePosition || "center";
  } else {
    els.memePhoto.classList.remove("has-image");
    els.memePhoto.style.backgroundImage = "";
    els.memePhoto.style.backgroundPosition = "";
  }
  els.memeCard.classList.remove("flash");
  void els.memeCard.offsetWidth;
  els.memeCard.classList.add("flash");
}

function pushLog(text) {
  state.log.unshift(text);
}

function applyEffects(effects) {
  Object.entries(effects || {}).forEach(([key, value]) => {
    state.stats[key] = clamp((state.stats[key] || 0) + value);
  });
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getBusyText(action) {
  const phrases = busyPhrases[action.id] || busyPhrases.default;
  return sample(phrases);
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

function getAudioContext() {
  if (!soundEnabled) return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playSound(type) {
  const context = getAudioContext();
  if (!context) return;

  const patterns = {
    action: [
      [220, 0.07, "square", 0.05, 0],
      [330, 0.08, "square", 0.045, 0.07],
    ],
    frog: [
      [150, 0.08, "sawtooth", 0.06, 0],
      [110, 0.11, "sawtooth", 0.05, 0.1],
      [180, 0.08, "sawtooth", 0.05, 0.2],
    ],
    nogei: [
      [196, 0.1, "square", 0.05, 0],
      [247, 0.1, "square", 0.05, 0.11],
      [294, 0.16, "square", 0.05, 0.22],
    ],
    tuktuk: [
      [95, 0.05, "square", 0.055, 0],
      [95, 0.05, "square", 0.055, 0.09],
      [128, 0.05, "square", 0.05, 0.18],
      [128, 0.05, "square", 0.05, 0.27],
    ],
    tinder: [
      [523, 0.08, "triangle", 0.045, 0],
      [659, 0.08, "triangle", 0.045, 0.09],
      [784, 0.12, "triangle", 0.04, 0.18],
    ],
    ending: [
      [262, 0.12, "triangle", 0.05, 0],
      [330, 0.12, "triangle", 0.05, 0.14],
      [392, 0.2, "triangle", 0.05, 0.28],
    ],
    toggle: [[440, 0.08, "triangle", 0.035, 0]],
    default: [
      [294, 0.07, "square", 0.045, 0],
      [220, 0.1, "square", 0.04, 0.09],
    ],
  };

  (patterns[type] || patterns.default).forEach(([frequency, duration, wave, volume, delay]) => {
    playTone(context, frequency, duration, wave, volume, delay);
  });
}

function playTone(context, frequency, duration, wave, volume, delay) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

init();
